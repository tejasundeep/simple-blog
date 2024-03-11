import Link from "next/link";
import { Card } from "react-bootstrap";
import TruncatedContent from "@/components/others/TruncateContent";
import { useRouter } from "next/router";
import Image from "next/image";

const HomePost = ({ title, image, date, content, slug, onSearch }) => {
    const router = useRouter();
    const currentUrl = router.asPath;
    const handleSearch = () => onSearch("");

    const readMoreLink = currentUrl.startsWith("/post/") ? (
        <Link
            href={`/post/${slug}`}
            className="float-end"
            onClick={handleSearch}
        >
            Read more
        </Link>
    ) : (
        <Link href={`/post/${slug}`} className="float-end">
            Read more
        </Link>
    );

    return (
        <article className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <Card className="rounded-4 border-0">
                <Link href={`/post/${slug}`} passHref>
                    <Card.Img
                        className="rounded-top"
                        variant="top"
                        src={image}
                        alt={title}
                        title={title}
                    />
                </Link>
                <Card.Body className="p-4">
                    <Card.Title as="h5">{title}</Card.Title>
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
                    <TruncatedContent content={content} length={82} />
                    <Card.Subtitle className="mb-2 text-muted" as="time">
                        <Image
                            width="18"
                            height="18"
                            className="svg_icon date"
                            src="/icons/date.svg"
                            alt="Date"
                        />{" "}
                        {date}
                    </Card.Subtitle>
                    {readMoreLink}
                </Card.Body>
            </Card>
        </article>
    );
};

export default HomePost;
