import { useState, useEffect } from "react";
import { ListGroup, Card } from "react-bootstrap";
import { scroller } from "react-scroll";

const PostTracker = ({ title }) => {
    const [posts, setPosts] = useState([]);
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST

    useEffect(() => {
        if (!posts.length) {
            fetch(`${appUrl}/api/read-post`)
                .then((response) =>
                    response.ok
                        ? response.json()
                        : Promise.reject(`HTTP error: ${response.status}`)
                )
                .then(
                    (data) =>
                        JSON.stringify(data.posts) !== JSON.stringify(posts) &&
                        setPosts(data.posts)
                )
                .catch((error) =>
                    console.error("Error fetching posts:", error)
                );
        }
    }, [posts, appUrl]);

    const handleClick = (className) =>
        scroller.scrollTo(className, {
            duration: 100,
            delay: 100,
            smooth: true,
            offset: -85,
        });

    const renderHeadings = (headings) =>
        headings.map((heading, index) => {
            // Remove the <h2> tags and then strip any other HTML tags
            const cleanHeading = heading
                .replace(/<h2[^>]*>(.*?)<\/h2>/g, "$1")
                .replace(/<[^>]*>/g, "");
            return (
                <ListGroup.Item
                    key={index}
                    className="list-group-item"
                    onClick={() => handleClick(`post_heading_${index + 1}`)}
                >
                    <span>{cleanHeading}</span>
                </ListGroup.Item>
            );
        });

    return posts
        .filter((post) => post.title === title)
        .map((post, index) => (
            <Card
                as="section"
                className="p-4 rounded-4 border-0 table_content"
                key={index}
            >
                <h5 className="mb-3">Table of content</h5>
                <ListGroup className="progress_tracker">
                    {renderHeadings(
                        post.content.match(/<h2[^>]*>(.*?)<\/h2>/g) || []
                    )}
                </ListGroup>
            </Card>
        ));
};

export default PostTracker;
