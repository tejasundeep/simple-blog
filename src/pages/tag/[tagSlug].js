import React, { useState } from "react";
import { Row, Container } from "react-bootstrap";
import MetaHead from "@/components/meta";
import NavBar from "@/components/header";
import SeoUrl from "@/components/others/SeoUrl";
import HomePost from "@/components/post/home";
import Pagination from "@/components/pagination";

export async function getServerSideProps({ params }) {
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
    const response = await fetch(appUrl + "/api/read-post");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    const tagSlug = params.tagSlug;
    const tagPosts = data.posts.filter((post) =>
        SeoUrl(post.tags).includes(tagSlug)
    );

    return { props: { tagPosts, tagSlug } };
}

export default function Tag({ tagSlug, tagPosts }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [visiblePosts, setVisiblePosts] = useState(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);
    const filteredPosts = tagPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadMorePosts = () => {
        setVisiblePosts(visiblePosts + process.env.NEXT_PUBLIC_PAGINATION_LIMIT); // Increase the number of visible posts
    };

    return (
        <>
            <MetaHead title={tagSlug} />
            <NavBar
                logo="./../logo.svg"
                onSearch={setSearchQuery}
                searchIcon="./../icons/search.svg"
            />
            <Container as="main">
                <Row as="section" className="blog_posts mb-4">
                    <h2 className="text-capitalize mt-4 mb-0">{tagSlug}</h2>
                    {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                        <HomePost
                            key={post.id}
                            title={post.title}
                            date={post.date}
                            image={post.image}
                            content={post.content}
                            slug={SeoUrl(post.title)}
                        />
                    ))}
                    {visiblePosts < filteredPosts.length ? (
                        <Pagination onClick={loadMorePosts} enabled={true} />
                    ) : (
                        <Pagination onClick={loadMorePosts} enabled={false} />
                    )}
                </Row>
            </Container>
        </>
    );
}
