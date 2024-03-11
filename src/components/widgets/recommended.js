import { Card } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import TruncatedContent from "@/components/others/TruncateContent";
import SeoUrl from "@/components/others/SeoUrl";

const RecommendedPostsComponent = ({ recommendedPosts }) => (
    <>
        <div className="d-flex align-items-center mt-3">
            <h3 className="mt-4 mb-0">Recommended for you</h3>
            <div className="ms-5 vertical-line"></div>
        </div>
        {recommendedPosts.map((post, index) => <RecommendedPost key={index} {...post} slug={SeoUrl(post.title)} />)}
    </>
);

const RecommendedPost = ({ title, image, date, content, slug }) => (
    <article className="col-lg-4 col-md-6 col-sm-12 mt-4">
        <Card className="rounded-4 border-0">
            <Link href={`/post/${slug}`} passHref>
                <Card.Img className="rounded-top" variant="top" src={image} alt={title} title={title} />
            </Link>
            <Card.Body className="p-4">
                <Card.Title as="h5">{title}</Card.Title>
                <TruncatedContent content={content} length={35} />
                <Card.Subtitle className="mb-2 text-muted" as="time">
                    <Image width="18" height="18" className="svg_icon date" src="/icons/date.svg" alt="Date" />
                    {date}
                </Card.Subtitle>
                <Link href={`/post/${slug}`} className="float-end">Read more</Link>
            </Card.Body>
        </Card>
    </article>
);

export default RecommendedPostsComponent;