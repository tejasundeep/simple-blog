import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import nextCookies from "next-cookies";
import { Card, Form, Button } from "react-bootstrap";
import CryptoJS from "crypto-js";

const AdminAuth = ({ onAuthenticated, initialAuth }) => {
    const correctPasswordHash = process.env.NEXT_PUBLIC_ADMINCP_PASS_HASH;
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [authenticated, setAuthenticated] = useState(initialAuth);

    useEffect(() => {
        onAuthenticated(authenticated);
    }, [authenticated, onAuthenticated]);

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        const passwordHash = CryptoJS.SHA512(password).toString();
        if (passwordHash === correctPasswordHash) {
            Cookies.set("adminAuth", "true", {
                expires: 1 / 12,
                secure: true,
                sameSite: "strict",
            });
            setAuthenticated(true);
        } else {
            setError("Incorrect password");
        }
    };

    return (
        <Card className="p-4 rounded-4 border-0">
            <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        isInvalid={!!error}
                    />
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Card>
    );
};

AdminAuth.getInitialProps = async (ctx) => {
    const { adminAuth } = nextCookies(ctx);

    return {
        initialAuth: adminAuth === 'true' || false,
    }
}

export default AdminAuth;
