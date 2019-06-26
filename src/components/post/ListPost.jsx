import React from "react"
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Card } from "react-bootstrap";
import { withRouter } from "react-router-dom";
const LIST_POSTS = gql`
{
    posts: public_posts {
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

const Posts = ({history}) => {
    return (
        <Query query={LIST_POSTS}>
            {({ loading, error, data }) => {
                if (error) {
                    return <p>{JSON.stringify(error)}</p>
                }
                if (loading || !data) return <p>Loading</p>
                let children = []
                for (let i = 0; i < data.posts.length; i++) {
                    let post = data.posts[i]
                    children.push(createCard(post, i)(history))
                }
                return <ul>{children}</ul>
            }}
        </Query>
    )
}

const createCard = (post, key) => (history) => {
    return <Card key={key} onClick={_ => history.push(`/post/${post.id}`)}>
        <Card.Title>
            <Card.Text> {post.title} </Card.Text>
        </Card.Title>
        <Card.Img variant="top" src="https://picsum.photos/id/649/685/180" />
        <Card.Body>
            <Card.Text>
                {post.content}
            </Card.Text>
        </Card.Body>
    </Card>
}
export default withRouter(Posts);