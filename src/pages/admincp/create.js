import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import MetaHead from "@/components/meta";
import NavBar from "@/components/header";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import AdminAuth from "@/components/auth";
import AdminPost from "@/components/post/admin";
import SeoUrl from "@/components/others/SeoUrl";
import config from "@/database/config.json";
import Image from "next/image";

const CreateBlogPost = () => {
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST
    const [posts, setPosts] = useState([]);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    const editorRef = useRef();
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor, ClassicEditor } = editorRef.current || {};

    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [postCategory, setPostCategory] = useState("webstories");
    const [postTags, setPostTags] = useState("");
    const [postMetaTitle, setPostMetaTitle] = useState("");
    const [postMetaDesc, setPostMetaDesc] = useState("");
    const [postImage, setPostImage] = useState("");

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    let filteredPosts = posts;

    if (searchQuery !== "") {
        filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const [alertMessage, setAlertMessage] = useState(null);

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setPostContent(data);
    };

    const handleTextareaChange = (event) => {
        const data = event.target.value;
        setPostContent(data);
    };

    const handleTitleChange = (event) => {
        setPostTitle(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setPostCategory(event.target.value);
    };

    const handleTagsChange = (event) => {
        setPostTags(event.target.value);
    };

    const handleMetaTitleChange = (event) => {
        setPostMetaTitle(event.target.value);
    };

    const handleMetaDescChange = (event) => {
        setPostMetaDesc(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setPostImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImageUrl(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formFields = {
            image: postImage,
            title: postTitle,
            category: postCategory,
            tags: postTags,
            metatitle: postMetaTitle,
            metadesc: postMetaDesc,
            content: postContent,
        };

        let formError = null;
        for (const key in formFields) {
            if (!formFields[key]) {
                formError = `${key} cannot be empty`;
                break;
            }
        }

        if (formError) {
            setAlertMessage("Failed: " + formError);
            setTimeout(() => {
                setAlertMessage(null);
            }, 2000);
            return;
        } else {
            setAlertMessage("Post created successfully");
            setTimeout(() => {
                setAlertMessage(null);
            }, 2000);
        }

        // All form fields are valid, submit the form
        const formData = new FormData();
        formData.append("image", postImage);
        formData.append("title", postTitle);
        formData.append("category", postCategory);
        formData.append("tags", postTags);
        formData.append("metatitle", postMetaTitle);
        formData.append("metadesc", postMetaDesc);
        formData.append("content", postContent);

        fetch("/api/create-post", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setPostImage("");
                setPostTitle("");
                setPostCategory("webstories");
                setPostTags("");
                setPostMetaTitle("");
                setPostMetaDesc("");
                setPostContent("");
                setPreviewImageUrl(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch((error) => {
                console.error(error);
                setAlertMessage("Failed to create post");
                setTimeout(() => {
                    setAlertMessage(null);
                }, 2000);
            });
    };

    useEffect(() => {
        editorRef.current = {
            CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
            ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
        };
        setEditorLoaded(true);

        const authCookie = Cookies.get("adminAuth");
        if (authCookie) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        function fetchPosts() {
            fetch(`${appUrl}/api/read-post`)
                .then((response) => {
                    if (!response.ok)
                        throw new Error(`HTTP error: ${response.status}`);
                    return response.json();
                })
                .then((data) => {
                    if (JSON.stringify(data.posts) !== JSON.stringify(posts)) {
                        setPosts(data.posts);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching posts:", error);
                });
        }
        if (!posts.length) {
            fetchPosts();
        }
    }, [posts, appUrl]);

    return (
        <>
            {searchQuery === "" ? (
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

                    <Container as="main">
                        {!isAuthenticated && (
                            <Row>
                                <Col md={6} className="mx-auto my-3">
                                    <h2 className="text-capitalize my-4">
                                        Login
                                    </h2>
                                    <AdminAuth
                                        onAuthenticated={setIsAuthenticated}
                                    />
                                </Col>
                            </Row>
                        )}

                        {isAuthenticated && (
                            <Row>
                                <Col md={6} className="mx-auto my-3">
                                    <>
                                        <h2 className="text-capitalize my-4">
                                            Create post
                                        </h2>

                                        {alertMessage && (
                                            <Alert
                                                variant={
                                                    alertMessage.startsWith(
                                                        "Failed"
                                                    )
                                                        ? "danger"
                                                        : "success"
                                                }
                                                className="mt-3"
                                            >
                                                {alertMessage.startsWith(
                                                    "Failed"
                                                )
                                                    ? alertMessage
                                                    : "Post created successfully"}
                                            </Alert>
                                        )}

                                        <Card className="p-4 rounded-4 border-0">
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="formBasicImage"
                                                >
                                                    <Form.Label>
                                                        Post Image
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        required
                                                    />
                                                    {previewImageUrl && (
                                                        <Image
                                                            src={
                                                                previewImageUrl
                                                            }
                                                            alt="Preview"
                                                            className="img-fluid mt-3"
                                                            width={300}
                                                            height={300}
                                                        />
                                                    )}
                                                </Form.Group>

                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="formBasicTitle"
                                                >
                                                    <Form.Label>
                                                        Post Title
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter post title"
                                                        value={postTitle}
                                                        onChange={
                                                            handleTitleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="formBasicCategory"
                                                >
                                                    <Form.Label>
                                                        Post Category
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={postCategory}
                                                        onChange={
                                                            handleCategoryChange
                                                        }
                                                        required
                                                    >
                                                        <option value="webstories">
                                                            WebStories
                                                        </option>
                                                        <option value="trading">
                                                            Trading
                                                        </option>
                                                        <option value="news">
                                                            News
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="formBasicTags"
                                                >
                                                    <Form.Label>
                                                        Post Tags
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter post tags"
                                                        value={postTags}
                                                        onChange={
                                                            handleTagsChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="formBasicMetaTitle"
                                                >
                                                    <Form.Label>
                                                        Post Meta Title
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter meta title"
                                                        value={postMetaTitle}
                                                        onChange={
                                                            handleMetaTitleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group
                                                    controlId="formBasicMetaDesc"
                                                    className="mb-3"
                                                >
                                                    <Form.Label>
                                                        Post Meta Description
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder="Enter meta description"
                                                        value={postMetaDesc}
                                                        onChange={
                                                            handleMetaDescChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="formBasicContent"
                                                >
                                                    <p className="mb-2">
                                                        Post Description
                                                    </p>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <Button
                                                            variant="outline-primary"
                                                            onClick={() =>
                                                                setEditorLoaded(
                                                                    !editorLoaded
                                                                )
                                                            }
                                                        >
                                                            {editorLoaded
                                                                ? "Switch to HTML View"
                                                                : "Switch to Editor View"}
                                                        </Button>
                                                    </div>
                                                    {editorLoaded ? (
                                                        <CKEditor
                                                            editor={
                                                                ClassicEditor
                                                            }
                                                            data={postContent}
                                                            onChange={
                                                                handleEditorChange
                                                            }
                                                            config={{
                                                                toolbar: {
                                                                    items: [
                                                                        "heading",
                                                                        "|",
                                                                        "bold",
                                                                        "italic",
                                                                        "link",
                                                                        "bulletedList",
                                                                        "numberedList",
                                                                        "blockQuote",
                                                                        "insertTable",
                                                                        "undo",
                                                                        "redo",
                                                                    ],
                                                                },
                                                                heading: {
                                                                    options: [
                                                                        {
                                                                            model:
                                                                                "paragraph",
                                                                            title:
                                                                                "Paragraph",
                                                                            class:
                                                                                "ck-heading_paragraph",
                                                                        },
                                                                        {
                                                                            model:
                                                                                "heading1",
                                                                            view:
                                                                                "h1",
                                                                            title:
                                                                                "Heading 1",
                                                                            class:
                                                                                "ck-heading_heading1",
                                                                        },
                                                                        {
                                                                            model:
                                                                                "heading2",
                                                                            view:
                                                                                "h2",
                                                                            title:
                                                                                "Heading 2",
                                                                            class:
                                                                                "ck-heading_heading2",
                                                                        },
                                                                        {
                                                                            model:
                                                                                "heading3",
                                                                            view:
                                                                                "h3",
                                                                            title:
                                                                                "Heading 3",
                                                                            class:
                                                                                "ck-heading_heading3",
                                                                        },
                                                                        {
                                                                            model:
                                                                                "heading4",
                                                                            view:
                                                                                "h4",
                                                                            title:
                                                                                "Heading 4",
                                                                            class:
                                                                                "ck-heading_heading4",
                                                                        },
                                                                        {
                                                                            model:
                                                                                "heading5",
                                                                            view:
                                                                                "h5",
                                                                            title:
                                                                                "Heading 5",
                                                                            class:
                                                                                "ck-heading_heading5",
                                                                        },
                                                                        {
                                                                            model:
                                                                                "heading6",
                                                                            view:
                                                                                "h6",
                                                                            title:
                                                                                "Heading 6",
                                                                            class:
                                                                                "ck-heading_heading6",
                                                                        },
                                                                    ],
                                                                },
                                                            }}
                                                            required
                                                        />
                                                    ) : (
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={10}
                                                            placeholder="Enter post description as HTML"
                                                            value={postContent}
                                                            onChange={
                                                                handleTextareaChange
                                                            }
                                                            required
                                                        />
                                                    )}
                                                </Form.Group>

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                >
                                                    Create Post
                                                </Button>
                                            </Form>
                                        </Card>
                                    </>
                                </Col>
                            </Row>
                        )}
                    </Container>
                </>
            ) : (
                <>
                    <MetaHead
                        title={config.siteTitle}
                        description={config.siteDesc}
                    />
                    <NavBar logo="../../logo.svg" onSearch={setSearchQuery} />

                    <Container>
                        <Row className="blog_posts">
                            {filteredPosts.map((post, index) => (
                                <AdminPost
                                    key={index}
                                    title={post.title}
                                    date={post.date}
                                    image={post.image}
                                    content={post.content}
                                    slug={SeoUrl(post.title)}
                                />
                            ))}
                        </Row>
                    </Container>
                </>
            )}
        </>
    );
};

export default CreateBlogPost;
