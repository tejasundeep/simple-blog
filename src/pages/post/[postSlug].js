import { useState, useEffect } from "react";
import { Row, Container } from "react-bootstrap";
import MetaHead from "@/components/meta";
import NavBar from "@/components/header";
import SeoUrl from "@/components/others/SeoUrl";
import SinglePost from "@/components/post/postPage";
import LeftSideBar from "@/components/sidebar/left";
import RightSideBar from "@/components/sidebar/right";
import HomePost from "@/components/post/home";
import RecommendedPostsComponent from "@/components/widgets/recommended";
import config from "@/database/config.json";

async function fetchPosts() {
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST || process.env.NEXT_PUBLIC_LOCAL_HOST
    const response = await fetch(`${appUrl}/api/read-post`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    return data.posts;
}

export async function getServerSideProps({ params }) {
    let posts = await fetchPosts();
    let post = posts.find((post) => SeoUrl(post.title) === params.postSlug);

    if (!post || !post.category) {
        return { props: {} };
    }

    return { props: { post } };
}

export default function Post({ post }) {
    let [searchQuery, setSearchQuery] = useState("");
    let [allPosts, setAllPosts] = useState([]);
    let [filteredPosts, setFilteredPosts] = useState([]);
    let [recommendedPosts, setRecommendedPosts] = useState([]);

    useEffect(() => {
        fetchPosts()
            .then((data) => {
                setAllPosts(data);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    useEffect(() => {
        if (searchQuery !== "") {
            setFilteredPosts(
                allPosts.filter((post) =>
                    post.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredPosts([]);
        }
    }, [searchQuery, allPosts]);

    useEffect(() => {
        if (post) {
            let posts = allPosts
                .filter(
                    (recommendedPost) =>
                        recommendedPost.category === post.category &&
                        recommendedPost.title !== post.title
                )
                .slice(0, 3);

            setRecommendedPosts(posts);
        }
    }, [post, allPosts]);

    if (!post || !post.category) {
        return (
            <div>
                <h1>404 - Page Not Found</h1>
            </div>
        );
    }

    return (
        <>
            {searchQuery === "" ? (
                <>
                    <MetaHead
                        title={post.title}
                        description={post.content}
                        metatitle={post.metatitle}
                        metadesc={post.metadesc}
                        image={post.image}
                    />

                    <NavBar
                        logo="./../logo.svg"
                        onSearch={setSearchQuery}
                        searchIcon="./../icons/search.svg"
                    />

                    <Container as="main" className="single_post_page" fluid>
                        <Row>
                            <aside className="col-lg-3 col-md-4 col-sm-12 mt-4">
                                <LeftSideBar title={post.title} />
                            </aside>

                            <section className="col-lg-6 col-md-8 col-sm-12 mt-4">
                                <SinglePost
                                    title={post.title}
                                    date={post.date}
                                    image={post.image}
                                    content={post.content}
                                    slug={SeoUrl(post.title)}
                                />
                            </section>

                            <aside className="col-lg-3 col-md-12 col-sm-12 mt-4">
                                <RightSideBar
                                    category={post.category}
                                    title={SeoUrl(post.title)}
                                />
                            </aside>
                        </Row>
                        <Container className="mt-0">
                            <Row className="mb-5 recommended blog_posts">
                                <RecommendedPostsComponent recommendedPosts={recommendedPosts} />
                            </Row>
                        </Container>
                    </Container>
                </>
            ) : (
                <>
                    <MetaHead
                        title={config.siteTitle}
                        description={config.siteDesc}
                    />
                    <NavBar
                        logo="../../logo.svg"
                        onSearch={setSearchQuery}
                        searchIcon="./../icons/search.svg"
                    />

                    <Container>
                        <Row className="blog_posts">
                            {filteredPosts.map((post, index) => (
                                <HomePost
                                    key={index}
                                    title={post.title}
                                    date={post.date}
                                    image={post.image}
                                    content={post.content}
                                    slug={SeoUrl(post.title)}
                                    onSearch={setSearchQuery}
                                />
                            ))}
                        </Row>
                    </Container>
                </>
            )}
        </>
    );
}
