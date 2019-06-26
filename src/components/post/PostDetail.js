import React from "react"
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import * as auth from "../../AuthProvider";
import { Form, Button } from "react-bootstrap";
import moment from "moment"

export const POST_DETAIL = gql`
query PostDetail($postId: bigint) {
    posts: public_posts(where: {id: {_eq: $postId}}) {
      id
      updated_at
      topic
      content
      author {
        display_name
        username
        photo_url
      }
      title
      featured_image
    }
  }
`

export const ADD_COMMENT = gql`
mutation CreateComment($postId: bigint, $content: String){
  comments: insert_comments(objects: {post_id: $postId, content: $content}) {
    returning {
      id
      content
      updated_at
      user {
        username
        display_name
        photo_url
      }
    }
  }
}
`

export const LIST_POST_COMMENTS = gql`
query ListPostComments($postId: bigint){
  posts: public_posts(where: {id: {_eq: $postId}}) {
    id
    comments(order_by: {id: desc}) {
      id
      content
      updated_at
      user {
        username
        display_name
        photo_url
      }
    }
  }
}
`

const PostDetail = ({ match }) => {
  let postId = match.params.id
  return (
    <Query query={POST_DETAIL} variables={{ postId }}>
      {({ loading, error, data }) => {
        if (error) {
          return <p>{JSON.stringify(error)}</p>
        }
        if (loading || !data) return <p>Loading</p>
        if (data.posts.length > 0) {
          let post = data.posts[0]
          return (<>
            <h3> {post.title} </h3>
            <h4> {post.author.display_name} - {moment(post.updated_at).format('MM/DD/YYYY h:mm a')}</h4>
            <p>
              {post.content}
            </p>
            <hr />
            <h5>Comment</h5>
            <ListPostComments post={post} />
          </>)
        }
        return <p>404 NOT FOUND</p>
      }}
    </Query>
  )
}

const AddComment = ({ post }) => {
  let authState = auth.currentAuthState()
  let authorId = (authState.user || {}).uid;
  if (!authorId) {
    return null
  }
  let commentContent;
  return <Mutation
    mutation={ADD_COMMENT}
    update={(store, { data: { comments } }) => {
      let newComment = comments.returning[0]
      const queryAndVars = { query: LIST_POST_COMMENTS, variables: { postId: post.id } };
      const data = store.readQuery(queryAndVars)
      data.posts[0].comments.unshift(newComment)
      store.writeQuery({ ...queryAndVars, data })
    }}
  >
    {(addComment, { data }) => (
      <>
        <Form onSubmit={e => {
          e.preventDefault();
          let variables = { postId: post.id, content: commentContent.value };
          console.log("variables: ", variables)
          addComment({ variables });
          commentContent.value = '';
        }}>
          <Form.Group>
            <Form.Control type="text" placeholder="Add New Comment" ref={node => { commentContent = node }} />
          </Form.Group>
          <Button variant="primary" type="submit" hidden>Create comment</Button>
        </Form>
      </>
    )
    }
  </Mutation>
}

const ListPostComments = ({ post }) => {
  const postId = post.id;
  return <Query query={LIST_POST_COMMENTS} variables={{ postId }}>
    {({ loading, error, data }) => {
      if (error) {
        return <p>{JSON.stringify(error)}</p>
      }
      if (loading || !data) return <p>Loading</p>
      if (data.posts.length > 0) {
        let post = data.posts[0]
        let comments = post.comments || [];
        return <>
          <AddComment post={post} />
          <ul>
            {comments.map((comment) => <li key={comment.id}>{comment.content} <span>&#183;</span> {comment.user.display_name} <span>&#183;</span> {moment(comment.updated_at).format('MM/DD/YYYY h:mm a')} </li>)}
          </ul>
        </>
      }
      return <p>404 NOT FOUND</p>
    }}
  </Query>
}

export default PostDetail;
