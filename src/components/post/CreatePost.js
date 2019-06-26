import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import React from "react"
import { Form, Button } from "react-bootstrap";
import * as auth from "../../AuthProvider"
const ADD_POST = gql`
mutation InsertPost($content: String, $title: String, $topic: String, $authorId: String){
  insert_posts(objects: {content: $content, title: $title, topic: $topic}) {
    returning {
      id
      author {
        username
      }
      title
      content
      topic
      featured_image
    }
  }
}
`

const CreatePost = () => {
  let authState = auth.currentAuthState()
  let authorId = (authState.user || {}).uid;
  let topic, title, content;
  if (!authorId) {
    return null
  }
  return <Mutation mutation={ADD_POST}>
    {(addPost, { data }) => (
      <>
        <Form onSubmit={e => {
          e.preventDefault();
          let variables = { topic: topic.value, title: title.value, content: content.value, authorId };
          console.log("variables: ", variables)
          addPost({ variables });
          topic.value = '';
          title.value = '';
          content.value = '';
        }}>
          <Form.Group controlId="formBasicTopic">
            <Form.Label>Topic</Form.Label>
            <Form.Control type="text" placeholder="Topic" ref={node => { topic = node }} />
          </Form.Group>
          <Form.Group controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Title" ref={node => { title = node }} />
          </Form.Group>
          <Form.Group controlId="formBasicContent">
            <Form.Label>Content</Form.Label>
            <Form.Control type="text" placeholder="Content" ref={node => { content = node }} />
          </Form.Group>
          <Button variant="primary" type="submit">Create Post</Button>
        </Form>
      </>
    )
    }
  </Mutation>
}

export default CreatePost;