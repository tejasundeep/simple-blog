import { ListGroup, Card, Tabs, Tab } from "react-bootstrap";
import SidePostWidget from "@/components/post/side";
import SeoUrl from "@/components/others/SeoUrl";
import { useState, useEffect } from "react";

const RelatedPosts = ({ category }) => {
    const [posts, setPosts] = useState([]);
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST

    useEffect(() => {
        fetch(`${appUrl}/api/read-post`)
            .then((res) => res.json())
            .then((data) => {
                if (JSON.stringify(data.posts) !== JSON.stringify(posts)) {
                    setPosts(data.posts)
                }
            })
            .catch((error) =>
                console.error("Error fetching posts:", error)
            );
    }, [appUrl, posts]);

    const renderPost = (post, index) => (
        <SidePostWidget
            key={index}
            title={post.title}
            date={post.date}
            image={post.image}
            slug={SeoUrl(post.title)}
        />
    );

    return (
        <Card as="section" className="mb-4 p-4 rounded-4 border-0">
            <Tabs
                variant="pills"
                defaultActiveKey="relative"
                id="uncontrolled-tab"
                className="mb-3"
            >
                <Tab eventKey="relative" title="Relative">
                    <ListGroup>
                        {posts
                            .slice(0, 3)
                            .filter((post) => post.category === category)
                            .map(renderPost)}
                    </ListGroup>
                </Tab>
                <Tab eventKey="all" title="All">
                    <ListGroup>{posts.slice(0, 3).map(renderPost)}</ListGroup>
                </Tab>
            </Tabs>
        </Card>
    );
};

export default RelatedPosts;
