import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { Container, Row, Col, Button } from "react-bootstrap";
import NavBar from "@/components/header";
import MetaHead from "@/components/meta";
import Link from "next/link";
import AdminPost from "@/components/post/admin";
import SeoUrl from "@/components/others/SeoUrl";
import AdminAuth from "@/components/auth";
import Pagination from "@/components/pagination";
import Image from "next/image";
import config from "@/database/config.json";

export default function AdminCP({ initialPosts }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState(initialPosts || []);
    const [filteredPosts, setFilteredPosts] = useState([]);
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST

    useEffect(() => {
        const authCookie = Cookies.get("adminAuth");
        setIsAuthenticated(Boolean(authCookie));
    }, []);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await fetch(`${appUrl}/api/read-post`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();
            if (JSON.stringify(data.posts) !== JSON.stringify(posts))
                setPosts(data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [appUrl, posts]);

    useEffect(() => {
        if (!posts.length) fetchPosts();
    }, [fetchPosts, posts]);

    useEffect(() => {
        setFilteredPosts(
            posts.filter((post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [posts, searchQuery]);

    const handleLogout = () => {
        Cookies.remove("adminAuth");
        setIsAuthenticated(false);
    };

    const loadMorePosts = () => setCurrentPage(currentPage + 1);

    const POSTS_PER_PAGE = 5;
    const currentPosts = filteredPosts.slice(0, currentPage * POSTS_PER_PAGE);

    return (
        <>
            <MetaHead title={config.siteTitle} description={config.siteDesc} />
            <NavBar
                logo="../../logo.svg"
                onSearch={setSearchQuery}
                searchIcon="./../icons/search.svg"
            />
            <Container>
                {!isAuthenticated ? (
                    <Row>
                        <Col md={6} className="mx-auto my-3">
                            <h2 className="text-capitalize my-4">Login</h2>
                            <AdminAuth onAuthenticated={setIsAuthenticated} />
                        </Col>
                    </Row>
                ) : (
                    <>
                        <div className="d-flex justify-content-between admin_custom_head">
                            <span className="mt-4">
                                <h2 className="d-inline-block">Posts</h2>
                                <p className="btn btn-dark rounded-5 px-3 py-2 mx-3">
                                    {posts.length}
                                </p>
                            </span>
                            <span>
                                <Button
                                    className="btn btn-danger rounded-pill mx-2"
                                    onClick={handleLogout}
                                >
                                    <Image
                                        width="22"
                                        height="22"
                                        className="svg_icon"
                                        src="./icons/logout.svg"
                                        alt="Logout"
                                    />{" "}
                                    Logout
                                </Button>
                                <Link
                                    className="btn btn-success rounded-pill my-4"
                                    href="/admincp/create"
                                >
                                    <Image
                                        width="22"
                                        height="22"
                                        className="svg_icon"
                                        src="./icons/plus.svg"
                                        alt="Create"
                                    />{" "}
                                    Create
                                </Link>
                            </span>
                        </div>

                        <Row as="section" className="blog_posts mb-4">
                            {currentPosts.map((post, index) => (
                                <AdminPost
                                    key={index}
                                    title={post.title}
                                    metatitle={post.metatitle}
                                    metadesc={post.metadesc}
                                    category={post.category}
                                    tags={post.tags}
                                    date={post.date}
                                    image={post.image}
                                    content={post.content}
                                    slug={SeoUrl(post.title)}
                                    onUpdate={fetchPosts}
                                />
                            ))}
                        </Row>

                        {currentPage * POSTS_PER_PAGE < filteredPosts.length ? (
                            <Pagination
                                onClick={loadMorePosts}
                                enabled={true}
                            />
                        ) : (
                            <Pagination
                                onClick={loadMorePosts}
                                enabled={false}
                            />
                        )}
                    </>
                )}
            </Container>
        </>
    );
}

export async function getServerSideProps() {
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
    const res = await fetch(`${appUrl}/api/read-post`);
    const data = await res.json();

    return { props: { initialPosts: data.posts } };
}
