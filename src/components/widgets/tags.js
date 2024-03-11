import { Card } from "react-bootstrap";
import SeoUrl from "@/components/others/SeoUrl";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

const PostTags = ({ title }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
            const response = await fetch(`${appUrl}/api/read-post`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            } else {
                console.error("HTTP error:", response.status);
            }
        };

        if (!posts.length) {
            fetchPosts();
        }
    }, [posts.length]); // Include posts.length in the dependency array

    const filteredPosts = posts.filter((post) => SeoUrl(post.title) === title);

    return (
        <Card as="section" className="mb-4 p-4 rounded-4 border-0 tags">
            <h5 className="mb-3">Topics</h5>
            {filteredPosts.map((post, index) => (
                <ul className="topics" key={index}>
                    {post.tags.split(", ").map((tag, index) => (
                        <li key={index}>
                            <Link href={`/tag/${SeoUrl(tag)}`}>
                                <Image
                                    src="./../icons/tag.svg"
                                    width="22"
                                    height="22"
                                    alt="Tag"
                                />{" "}
                                {tag}
                            </Link>
                        </li>
                    ))}
                </ul>
            ))}
        </Card>
    );
};

export default PostTags;
