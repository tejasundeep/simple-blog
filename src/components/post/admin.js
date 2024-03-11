import React, { useRef, useState, useEffect } from "react";
import { ButtonGroup, Card, Modal, Button } from "react-bootstrap";
import TruncatedContent from "@/components/others/TruncateContent";
import Image from "next/image";

const AdminPost = ({ title, metatitle, metadesc, category, tags, image, date, content, slug, onUpdate }) => {
    const editorRef = useRef(null);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor, ClassicEditor } = editorRef.current || {};

    useEffect(() => {
        editorRef.current = {
            CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
            ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
        };
        setEditorLoaded(true);
        setUpdatedTitle(title);
        setUpdatedMetaTitle(metatitle);
        setUpdatedMetaDesc(metadesc);
        setUpdatedCategory(category);
        setUpdatedTags(tags);
        setUpdatedContent(content);
    }, [title, metatitle, metadesc, category, tags, content]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedMetaTitle, setUpdatedMetaTitle] = useState(metatitle);
    const [updatedMetaDesc, setUpdatedMetaDesc] = useState(metadesc);
    const [updatedCategory, setUpdatedCategory] = useState(category);
    const [updatedTags, setUpdatedTags] = useState(tags);
    const [updatedContent, setUpdatedContent] = useState(content);
    const [updatedImage, setUpdatedImage] = useState(null);
    const [isHTMLView, setIsHTMLView] = useState(false);

    const handleDeleteConfirmed = async () => {
        const response = await fetch(`/api/delete-post?slug=${slug}`, {
            method: "DELETE",
        });

        const data = await response.json();
        console.log(data.message);

        setShowDeleteModal(false);
        onUpdate();
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleUpdateClick = async () => {
        const formData = new FormData();
        formData.append('title', updatedTitle);
        formData.append('metatitle', updatedMetaTitle);
        formData.append('metadesc', updatedMetaDesc);
        formData.append('category', updatedCategory);
        formData.append('tags', updatedTags);
        formData.append('content', updatedContent);
        if (updatedImage) formData.append('image', updatedImage);

        const response = await fetch(`/api/update-post?slug=${slug}`, {
            method: "PUT",
            body: formData,
        });

        const data = await response.json();
        console.log(data.message);

        setShowEditModal(false);
        onUpdate();
    };

    const toggleHTMLView = () => {
        setIsHTMLView(!isHTMLView);
    };

    return (
        <article className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <Card className="rounded-4 border-0">
                <Card.Img
                    className="rounded-top"
                    variant="top"
                    src={image}
                    alt={title}
                    title={title}
                />
                <Card.Body>
                    <Card.Title as="h5">{title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" as="time">
                        <Image
                            width="22"
                            height="22"
                            className="svg_icon date"
                            src="/icons/date.svg"
                            alt="Date"
                        />
                        {date}
                    </Card.Subtitle>
                    <TruncatedContent content={content} length={35} />
                    <ButtonGroup className="btn-group d-flex">
                        <Button onClick={handleEditClick} variant="primary">
                            <Image
                                width="22"
                                height="22"
                                className="svg_icon"
                                src="/icons/edit.svg"
                                alt="Edit"
                            />
                            Edit
                        </Button>
                        <Button onClick={handleDeleteClick} variant="danger">
                            <Image
                                width="22"
                                height="22"
                                className="svg_icon"
                                src="/icons/delete.svg"
                                alt="Delete"
                            />
                            Delete
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>

            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this post?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-light"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={handleDeleteConfirmed}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} enforceFocus={false} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="title" className="mb-2 fw-bold">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="metatitle" className="mb-2 fw-bold">Meta Title</label>
                            <input
                                type="text"
                                id="metatitle"
                                name="metatitle"
                                className="form-control"
                                value={updatedMetaTitle}
                                onChange={(e) => setUpdatedMetaTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="metadesc" className="mb-2 fw-bold">Meta Desc</label>
                            <input
                                type="text"
                                id="metadesc"
                                name="metadesc"
                                className="form-control"
                                value={updatedMetaDesc}
                                onChange={(e) => setUpdatedMetaDesc(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="category" className="mb-2 fw-bold">Category</label>
                            <select
                                id="category"
                                name="category"
                                className="form-select"
                                value={updatedCategory}
                                onChange={(e) => setUpdatedCategory(e.target.value)}
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
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="tags" className="mb-2 fw-bold">Tags</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                className="form-control"
                                value={updatedTags}
                                onChange={(e) => setUpdatedTags(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="image" className="mb-2 fw-bold">Image</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                className="form-control"
                                onChange={(e) => setUpdatedImage(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <p className="mb-2 fw-bold">Description</p>
                            <div className="mb-3">
                                <Button
                                    variant="outline-primary"
                                    onClick={toggleHTMLView}
                                >
                                    {isHTMLView
                                        ? "Switch to CKEditor"
                                        : "Switch to Textarea"}
                                </Button>
                            </div>
                            {isHTMLView ? (
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    value={updatedContent}
                                    onChange={(e) => setUpdatedContent(e.target.value)}
                                />
                            ) : editorLoaded ? (
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={updatedContent}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setUpdatedContent(data);
                                    }}
                                    config={{
                                        toolbar: [
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
                                        heading: {
                                            options: [
                                                {
                                                    model: "paragraph",
                                                    title: "Paragraph",
                                                    class: "ck-heading_paragraph",
                                                },
                                                {
                                                    model: "heading1",
                                                    view: "h1",
                                                    title: "Heading 1",
                                                    class: "ck-heading_heading1",
                                                },
                                                {
                                                    model: "heading2",
                                                    view: "h2",
                                                    title: "Heading 2",
                                                    class: "ck-heading_heading2",
                                                },
                                                {
                                                    model: "heading3",
                                                    view: "h3",
                                                    title: "Heading 3",
                                                    class: "ck-heading_heading3",
                                                },
                                                {
                                                    model: "heading4",
                                                    view: "h4",
                                                    title: "Heading 4",
                                                    class: "ck-heading_heading4",
                                                },
                                                {
                                                    model: "heading5",
                                                    view: "h5",
                                                    title: "Heading 5",
                                                    class: "ck-heading_heading5",
                                                },
                                                {
                                                    model: "heading6",
                                                    view: "h6",
                                                    title: "Heading 6",
                                                    class: "ck-heading_heading6",
                                                },
                                            ],
                                        },
                                    }}
                                />
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-light"
                        onClick={() => setShowEditModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={handleUpdateClick}
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </article>
    );
};

export default AdminPost;
