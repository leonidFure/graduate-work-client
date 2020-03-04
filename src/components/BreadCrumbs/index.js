import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import React from "react";



const BreadCrumbs = () => {
    const handleClick = (e) => {
        e.preventDefault();
        console.info('You clicked a breadcrumb.');
    };
    return(
        <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={handleClick}>
                Material-UI
            </Link>
            <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
                Core
            </Link>
            <Link
                color="textPrimary"
                href="/components/breadcrumbs/"
                onClick={handleClick}
                aria-current="page"
            >
                Breadcrumb
            </Link>
        </Breadcrumbs>
    )
};
export default BreadCrumbs;