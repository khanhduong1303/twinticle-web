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

const createCard2 = (post, key) => (history) => {
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

const createCard = (post, key) => (history) => {
    return (
        <Row  key={key} className="justify-content-md-center">
            <Col md={3} lg="3"></Col>
            <Col md={6} lg="6">
                <div onClick={_ => history.push(`/post/${post.id}`)} style={{padding: 5, marginTop: 30}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{width: 30, height: 30}} src={'https://avatarfiles.alphacoders.com/192/192908.jpg'} roundedCircle/>
                        <div style={{marginLeft: 5}}>
                            <Badge pill variant="primary" style={styles.text}>Môn Sinh</Badge>
                            <span style={{...styles.text, fontWeight: 'bold', marginLeft: 5}}>Ngô Chí Hiền</span>
                            <div style={{...styles.text, ...styles.grey}}>Nhà tập luyện Phú Thọ</div>
                        </div>
                    </div>

                    <div style={{...styles.text, ...styles.grey, marginTop: 20}}>7/10/2019</div>
                    <div style={{...styles.title}}>Vovinam Viet Vo Dao absent at 29th SEA GAMES</div>
                    <Image style={{maxWidth: 400, maxHeight: 400}} src="https://picsum.photos/id/649/685/180" />
                    <div style={{...styles.text, ...styles.grey, marginTop: 10}}>10 lượt xem</div>
                    <div style={{fontSize: 10}}>Vovinam - Việt võ đạo là môn võ được võ sư Nguyễn Lộc sáng lập vào năm 1936 nhưng lúc này hoạt động âm thầm, đến 1938 mới đem ra công khai đồng thời ông đề ra chủ thuyết "cách mạng tâm thân" để thúc đẩy môn sinh luôn luôn canh tân bản thân, và hướng thiện về thể chất lẫn tinh thần.[cần dẫn nguồn] Vovinam được phát triển dựa trên môn vật cổ truyền Việt Nam, kết hợp với những tinh hoa của các môn phái võ thuật Trung Quốc, Hàn Quốc và Nhật Bản. Dựa trên nguyên lý Cương Nhu Phối Triển, môn sinh Vovinam được tập luyện những đòn thế tay không, cùi chỏ, chân, gối cho đến các loại vũ khí như kiếm, đao, mã tấu, dao, côn, quạt... Ngoài ra, môn sinh còn được học cách đối phó với vũ khí bằng tay không, các lối phản đòn, khóa gỡ và các đòn vật. Trong các môn võ của Việt Nam, Vovinam được phát triển quy mô và rộng lớn nhất với nhiều môn sinh có mặt ở hơn 60 nước trên thế giới, trong đó có Ba Lan, Bỉ, Campuchia, Đan Mạch, Đức, Hoa Kỳ, Maroc, Na Uy, Nga, Pháp, România, Thụy Sĩ, Thụy Điển, Singapore, Uzbekistan, Thái Lan, Ý, Úc, Ấn Độ, Iran, Tây Ban Nha, Algérie, Đài Loan… Chánh chưởng quản Hội đồng Võ sư Vovinam hiện nay là võ sư Nguyễn Văn Chiếu.</div>
                </div>
                {createComment(COMMENTS)}
            </Col>
            <Col md={3} lg="3"></Col>
        </Row>
    )
}

const createComment = (comments = []) => {
    let view = []
    comments.forEach(comment => {
        view.push(
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 20}}>
                <Image style={{width: 20, height: 20}} src={comment.avatar} roundedCircle/>
                <span style={{fontSize: 10, marginLeft: 5}}>{comment.comment}</span>
            </div>
        )
    })
    return view
}

const COMMENTS = [
    {
        id: '1',
        avatar: 'https://avatarfiles.alphacoders.com/192/192908.jpg',
        comment: 'This is a first comment.......'
    },
    {
        id: '2',
        avatar: 'https://avatarfiles.alphacoders.com/192/192908.jpg',
        comment: 'This is a second comment.......'
    }
]

export default withRouter(Posts);

const styles = {
    text: {
        fontSize: 8
    },
    grey: {
        color: 'grey'
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold'
    }
}
