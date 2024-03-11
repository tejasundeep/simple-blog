import { Row, Col, Card } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const SocialWidget = () => (
    <Card as="section" className="mb-4 border-0 p-2 rounded-4 social_widget">
        <Card.Body className="p-4">
            <h5 className="mb-4">Follow</h5>
            <Row>
                {[
                    {
                        href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
                        alt: "Facebook",
                    },
                    {
                        href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
                        alt: "Instagram",
                    },
                    {
                        href: process.env.NEXT_PUBLIC_TWITTER_URL || "#",
                        alt: "Twitter",
                    },
                    {
                        href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
                        alt: "LinkedIn",
                    },
                    {
                        href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#",
                        alt: "Youtube",
                    },
                    {
                        href: process.env.NEXT_PUBLIC_TELEGRAM_URL || "#",
                        alt: "Telegram",
                    },
                    {
                        href: process.env.NEXT_PUBLIC_MEDIUM_URL || "#",
                        alt: "Medium"
                    },
                ].map(({ href, alt }, index) => (
                    <Col key={index} className="text-center">
                        <Link href={href} target="_blank">
                            <Image
                                width="28"
                                height="28"
                                src={`../../icons/${alt.toLowerCase()}.svg`}
                                alt={alt}
                            />
                        </Link>
                    </Col>
                ))}
            </Row>
        </Card.Body>
    </Card>
);

export default SocialWidget;
