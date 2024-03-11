import React, { useState, useEffect } from "react";
import { Carousel, Row, Col, Container } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import SeoUrl from "@/components/others/SeoUrl";

const CarouselComponent = () => {
    const [posts, setPosts] = useState([]);
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${appUrl}/api/read-post`);

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                // Limit the number of posts fetched to 5
                setPosts(data.posts.slice(0, 5));
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [posts, appUrl]);

    return (
        <Container fluid className="home_page_carousel">
            <Carousel interval={3000} pause={false} wrap={true}>
                {posts.map((post, index) => (
                    <Carousel.Item key={index}>
                        <Container className="mt-0">
                            <Row>
                                <Col md={6}>
                                    <Image
                                        width="636"
                                        height="358"
                                        className="d-block rounded-4"
                                        src={post.image}
                                        alt={post.title}
                                        priority
                                    />
                                </Col>
                                <Col md={6} className="my-auto">
                                    <h3 className="mt-4">{post.title}</h3>
                                    <p>{post.metadesc}</p>
                                    <Link href={`/post/${SeoUrl(post.title)}`}>Read More</Link>
                                </Col>
                            </Row>
                        </Container>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};

export default CarouselComponent;
