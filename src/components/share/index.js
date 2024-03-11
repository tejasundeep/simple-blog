import React, { useState } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

function ShareButton() {
    let [show, setShow] = useState(false);

    let handleClose = () => setShow(false);
    let handleShow = () => setShow(true);

    let handleCopyLink = (event) => {
        event.preventDefault();
        let input = document.createElement("input");
        input.style.position = "fixed";
        input.style.opacity = 0;
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        handleClose();
    };

    let handleShareFacebook = (event) => {
        event.preventDefault();
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
        );
        handleClose();
    };

    let handleShareInstagram = (event) => {
        event.preventDefault();
        window.open(
            `https://www.instagram.com/sharer.php?u=${window.location.href}`
        );
        handleClose();
    };

    let handleShareTwitter = (event) => {
        event.preventDefault();
        window.open(
            `https://twitter.com/intent/tweet?url=${window.location.href}`
        );
        handleClose();
    };

    let handleShareLinkedin = (event) => {
        event.preventDefault();
        window.open(
            `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`
        );
        handleClose();
    };

    return (
        <>
            <Button
                className="share rounded-pill"
                variant="primary"
                onClick={handleShow}
            >
                <Image
                    src="../../icons/share.svg"
                    alt="Search"
                    width="25"
                    height="25"
                />
                Share
            </Button>

            <Modal
                className="share_modal"
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Share</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-5 pb-5 modal-body">
                    <Row>
                        <Col className="text-center">
                            <Link href="/" onClick={handleShareFacebook}>
                                <Image
                                    src="../../icons/facebook.svg"
                                    alt="Facebook"
                                    width={35}
                                    height={35}
                                />
                            </Link>
                        </Col>
                        <Col className="text-center">
                            <Link href="/" onClick={handleShareInstagram}>
                                <Image
                                    src="../../icons/instagram.svg"
                                    alt="Instagram"
                                    width={35}
                                    height={35}
                                />
                            </Link>
                        </Col>
                        <Col className="text-center">
                            <Link href="/" onClick={handleShareTwitter}>
                                <Image
                                    src="../../icons/twitter.svg"
                                    alt="Twitter"
                                    width={35}
                                    height={35}
                                />
                            </Link>
                        </Col>
                        <Col className="text-center">
                            <Link href="/" onClick={handleShareLinkedin}>
                                <Image
                                    src="../../icons/linkedin.svg"
                                    alt="Linkedin"
                                    width={35}
                                    height={35}
                                />
                            </Link>
                        </Col>
                        <Col className="text-center">
                            <Link href="/" onClick={handleCopyLink}>
                                <Image
                                    src="../../icons/link.svg"
                                    alt="Copy Link"
                                    width={35}
                                    height={35}
                                />
                            </Link>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ShareButton;
