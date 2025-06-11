const Footer = () => {
    return (
        <footer className="bg-secondary text-white py-3 fixed bottom-0 w-full mt-10">
            <div className="container mx-auto ">
                <p className="text-center pr-48" >&copy; {new Date().getFullYear()} Mangut's Tech. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
