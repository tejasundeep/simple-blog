import { Card, Breadcrumb } from "react-bootstrap";
import ShareButton from "@/components/share";
import Image from "next/image";
import Link from "next/link";

let SinglePost = ({ title, image, date, content, slug }) => {
    return (
        <article className="card bg-sm-primary p-sm-4 p-md-5 rounded-4 border-0">
            <div className="d-flex justify-content-between">
                <Breadcrumb className="py-3">
                    <Breadcrumb.Item href="/" className="fw-bold">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={slug} className="fw-bold">
                        {title}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <ShareButton />
            </div>

            <Card.Title as="h3">{title}</Card.Title>

            <Card.Img
                className="my-3 rounded-4"
                variant="top"
                src={image}
                alt={title}
                title={title}
            />

            <Card.Body>
                <span className="author">
                    <Link href="/" className="text-muted" rel="author">
                        <Image
                            width="18"
                            height="18"
                            className="svg_icon date"
                            src="/small-logo.svg"
                            alt="Date"
                        />
                        Simple Blog
                    </Link>
                </span>
                <span className="mx-2 text-muted">|</span>
                <Card.Subtitle className="mb-2 text-muted" as="time">
                    <Image
                        width="18"
                        height="18"
                        className="svg_icon date"
                        src="/icons/date.svg"
                        alt="Date"
                    />
                    {date}
                </Card.Subtitle>
                <Card.Text
                    className="mt-4 mb-2"
                    as="div"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </Card.Body>
        </article>
    );
};

export default SinglePost;
