import React from "react";

const Pagination = ({ onClick, enabled }) => (
    <center>
        <button
            disabled={!enabled}
            className="btn btn-light my-4 d-flex justify-content-cent rounded-5"
            onClick={onClick}
        >
            {enabled ? "Load More" : "No More"}
        </button>
    </center>
);

export default Pagination;
