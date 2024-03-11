import { Container, Form, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import SeoUrl from "@/components/others/SeoUrl";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";

function NavBar({ logo, onSearch, searchIcon }) {
    const [activeItem, setActiveItem] = useState("");
    const [posts, setPosts] = useState([]);
    let appUrl = process.env.NEXT_PUBLIC_LOCAL_HOST

    const handleSearch = (query) => {
        onSearch(query);
    };

    const uniqueCategories = posts ? [...new Set(posts.map((post) => post.category))] : [];

    const router = useRouter();
    useEffect(() => {
        const currentPath = router.asPath;
        setActiveItem(currentPath === "/" ? "all" : currentPath.split("/")[2]);
    }, [router]);

    useEffect(() => {
        if (!posts.length) {
            fetch(`${appUrl}/api/read-post`)
                .then((response) => response.json())
                .then((data) => {
                    if (JSON.stringify(data.posts) !== JSON.stringify(posts)) {
                        setPosts(data.posts);
                    }
                })
                .catch((error) =>
                    console.error("Error fetching posts:", error)
                );
        }
    }, [posts, appUrl]);

    return (
        <Navbar bg="light" expand="lg" fixed="top">
            <Container fluid className="mt-0">
                <Navbar.Brand>
                    <Link href="/">
                        <Image
                            src={logo}
                            width={137}
                            height={35}
                            alt="Simple Blog"
                            priority={true}
                            loading="eager"
                        />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="mx-auto" navbarScroll>
                        <Link
                            className={`text-capitalize nav-link ${activeItem === "all" ? "active" : ""
                                }`}
                            href="/"
                        >
                            All
                        </Link>
                        {uniqueCategories.map((category, index) => (
                            <Link
                                key={index}
                                className={`text-capitalize nav-link ${activeItem === SeoUrl(category)
                                    ? "active"
                                    : ""
                                    }`}
                                href={`/category/${SeoUrl(category)}`}
                            >
                                {category}
                            </Link>
                        ))}
                        <Link
                            className={`text-capitalize nav-link`}
                            href="/admincp"
                        >
                            Admin Panel
                        </Link>
                    </Nav>
                    <Form className="d-flex search">
                        <Form.Group controlId="formSearch">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => handleSearch(e.target.value)}
                                autoComplete="off"
                            />
                            <Form.Label className="search_btn">
                                <Image
                                    src={searchIcon}
                                    alt="Search"
                                    width="25"
                                    height="25"
                                />
                            </Form.Label>
                        </Form.Group>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
