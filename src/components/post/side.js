import { ListGroup } from "react-bootstrap";
import Link from "next/link";
import SeoUrl from "@/components/others/SeoUrl";
import Image from "next/image";

let SidePostWidget = ({ title, date, image, slug }) => (
    <ListGroup.Item key={SeoUrl(title)}>
        <div className="row">
            <Image
                width="100"
                height="75"
                className="px-2 col-xxl-4 col-xl-5 col-md-12 img-thumbnail border-0"
                src={image}
                alt={title}
            />
            <span className="col-xxl-8 col-xl-7 col-md-12 my-auto">
                <Link href={slug} passHref>
                    <h5 className="my-1">{title}</h5>
                </Link>
                <p className="text-muted card-subtitle">
                    <Image
                        width="18"
                        height="18"
                        className="svg_icon date"
                        src="/icons/date.svg"
                        alt="Date"
                    />{" "}
                    {date}
                </p>
            </span>
        </div>
    </ListGroup.Item>
);

export default SidePostWidget;
