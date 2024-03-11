import React, { useState } from "react";
import { Row, Container } from "react-bootstrap";
import MetaHead from "@/components/meta";
import NavBar from "@/components/header";
import SeoUrl from "@/components/others/SeoUrl";
import HomePost from "@/components/post/home";
import Pagination from "@/components/pagination";

export async function getServerSideProps(context) {
    try {
        let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
        const response = await fetch(`${appUrl}/api/read-post`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const category = SeoUrl(context.params.categorySlug);
        const categoryPosts = data.posts.filter(
            (post) => SeoUrl(post.category) === category
        );
        return { props: { category, categoryPosts, initialSearchQuery: "" } };
    } catch (error) {
        console.error("Failed to fetch posts: ", error);
        return { props: { category: "", categoryPosts: [], initialSearchQuery: "" } };
    }
}

export default function Category({ category, categoryPosts, initialSearchQuery }) {
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [displayLimit, setDisplayLimit] = useState(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);

    const filteredPosts = categoryPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadMorePosts = () => {
        if (displayLimit < filteredPosts.length) {
            setDisplayLimit(displayLimit + process.env.NEXT_PUBLIC_PAGINATION_LIMIT);
        }
    }

    return (
        <>
            <MetaHead
                title={category}
                description="Know more about the latest trends in crypto,web3,government regulations, new listings, token & blockchain updates etc. at Simple Blog blogs"
            />
            <NavBar
                logo="./../logo.svg"
                onSearch={setSearchQuery}
                searchIcon="./../icons/search.svg"
            />
            <Container as="main">
                <Row as="section" className="blog_posts mb-4">
                    <h2 className="text-capitalize mt-4 mb-0">{category}</h2>
                    {filteredPosts.slice(0, displayLimit).map((post, index) => (
                        <HomePost
                            key={post.id || index}
                            {...post}
                            slug={SeoUrl(post.title)}
                        />
                    ))}
                    {displayLimit >= filteredPosts.length ? (
                        <Pagination onClick={loadMorePosts} enabled={false} />
                    ) : (
                        <Pagination onClick={loadMorePosts} enabled={true} />
                    )}
                </Row>
            </Container>
        </>
    );
}
