import { useState, useEffect, useMemo, useCallback } from "react";
import { Row, Container } from "react-bootstrap";
import MetaHead from "@/components/meta";
import HomePost from "@/components/post/home";
import SeoUrl from "@/components/others/SeoUrl";
import NavBar from "@/components/header";
import CarouselComponent from "@/components/carousel";
import Pagination from "@/components/pagination";
import config from "@/database/config.json";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = process.env.NEXT_PUBLIC_PAGINATION_LIMIT;

    useEffect(() => {
        let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
        fetch(`${appUrl}/api/read-post`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(data => setPosts(data.posts));
    }, []);

    const filteredPosts = useMemo(
        () =>
            searchQuery
                ? posts.filter((post) =>
                    post.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
                : posts,
        [searchQuery, posts]
    );

    const currentPosts = useMemo(
        () => filteredPosts.slice(0, currentPage * POSTS_PER_PAGE),
        [filteredPosts, currentPage]
    );

    const loadMorePosts = useCallback(
        () => setCurrentPage(currentPage + 1),
        [currentPage]
    );

    return (
        <>
            <MetaHead title={config.siteTitle} description={config.siteDesc} />
            <NavBar
                logo="./logo.svg"
                onSearch={setSearchQuery}
                searchIcon="./icons/search.svg"
            />
            <CarouselComponent />
            <Container as="main" className="home_container">
                <Row as="section" className="blog_posts mb-4">
                    {currentPosts.map((post) => (
                        <HomePost
                            key={post.id} // assuming each post has a unique 'id' property
                            title={post.title}
                            date={post.date}
                            image={post.image}
                            content={post.content}
                            slug={SeoUrl(post.title)}
                        />
                    ))}
                </Row>
                {currentPage * POSTS_PER_PAGE < filteredPosts.length ? (
                    <Pagination onClick={loadMorePosts} enabled={true} />
                ) : (
                    <Pagination onClick={loadMorePosts} enabled={false} />
                )}
            </Container>
        </>
    );
}
