import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MdArrowCircleLeft, MdArrowCircleRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { blogPosts } from './Blogs'; // Imports the massive data file we just made
import './Blogs.scss';

const BlogsListing = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(getVisibleItems());
    const [scrollStep, setScrollStep] = useState(0);
    const trackRef = useRef(null);

    function getVisibleItems() {
        const width = window.innerWidth;
        if (width > 1080) return 3;
        if (width > 768) return 2;
        return 1;
    }

    useEffect(() => {
        const updateVisible = () => {
            const items = getVisibleItems();
            setVisibleItems(items);
            setCurrentIndex(0);

            if (trackRef.current) {
                const item = trackRef.current.querySelector('.blog-slider-item-wrapper');
                if (item) {
                    const style = getComputedStyle(item);
                    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
                    setScrollStep(item.getBoundingClientRect().width + margin);
                }
            }
        };

        updateVisible();
        window.addEventListener('resize', updateVisible);
        return () => window.removeEventListener('resize', updateVisible);
    }, []);

    const handleNext = () => {
        const maxIndex = Math.max(0, blogPosts.length - visibleItems);
        if (currentIndex < maxIndex) {
            setCurrentIndex((prev) => prev + 1);
        }

        if (trackRef.current) {
            trackRef.current.scrollBy({
                left: scrollStep,
                behavior: 'smooth',
            });
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }

        if (trackRef.current) {
            trackRef.current.scrollBy({
                left: -scrollStep,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="app__wrapper mt-2 md:mt-10" aria-label="Blog posts">
            <h1 className="h1-text text-center text-3xl font-bold text-[#080061] mb-6">Mantra Foundations</h1>
            <div className="app__blogs__section">
                <motion.div
                    whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="blog-slider-container">
                        <div className="blog-slider" ref={trackRef}>
                            <div className="blog-slider-track">
                                {blogPosts.map((post) => (
                                    <div className="blog-slider-item-wrapper" key={post.id}>
                                        <BlogCard post={post} />
                                    </div>
                                ))}
                                <div className="blog-buffer-card" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    <div className="blog-nav flex flex-row gap-3 mt-4 justify-center">
                        <button onClick={handlePrev} disabled={currentIndex === 0}>
                            <MdArrowCircleLeft className="blog-slider-arrow" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= blogPosts.length - visibleItems}
                        >
                            <MdArrowCircleRight className="blog-slider-arrow" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

function BlogCard({ post }) {
    const isTall = post.title.length > 60;

    // Safely grab the first paragraph without HTML tags for the preview
    const firstParagraph = post.description
        .split('</p>')[0]
        .replace(/<[^>]+>/g, '')
        .slice(0, 160) + '...';

    return (
        <div className={`blog-slider-item ${isTall ? 'tall-card' : ''}`}>
            <h2 className="bold-text">{post.title}</h2>
            <h2 className="p-text text-[#080061]">
                {post.author} • {post.date}
            </h2>
            <p className="blog-intro-text italic">{post.intro}</p>
            <p className="description">{firstParagraph}</p>
            <Link to={`/blogs/${post.id}`} className="readmore-link">
                Read More
            </Link>
        </div>
    );
}

export default BlogsListing;