import './Blogs.scss';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from './Blogs';
import { useState } from 'react';

const BlogDetail = () => {
    const { id } = useParams();
    const blog = blogPosts.find((post) => post.id === Number(id));
    const [activeSection, setActiveSection] = useState(null);

    if (!blog) return <p className="text-white p-10">Blog not found.</p>;

    const handleSectionClick = (index) => {
        setActiveSection(index);
        // Remove highlight after 3 seconds
        setTimeout(() => setActiveSection(null), 3000);
    };

    // SEO LOGIC: Rule 2 - Strict Internal Linking based on Hierarchy Level
    let relatedPosts = [];

    if (blog.level === 3) {
        // Level 3 -> Links sideways to other Level 3 articles
        relatedPosts = blogPosts.filter(p => p.id !== blog.id && p.level === 3).slice(0, 3);
    } else if (blog.level === 2) {
        // Level 2 -> Links downward to Level 3 articles
        relatedPosts = blogPosts.filter(p => p.level === 3).slice(0, 3);
    } else if (blog.level === 1) {
        // Level 1 -> Links downward to Level 2 and Level 3 articles
        relatedPosts = blogPosts.filter(p => p.level === 2 || p.level === 3).slice(0, 3);
    } else {
        // Fallback
        relatedPosts = blogPosts.filter(p => p.id !== blog.id).slice(0, 3);
    }

    return (
        <section className="blog-detail-wrapper p-4 md:p-6 lg:p-10 bg-[#121212] min-h-screen">
            {/* Back Button at Top */}
            <Link 
                to="/blogs" 
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors mb-6 text-sm font-medium max-w-7xl mx-auto"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blogs
            </Link>

            <div className="blog-detail-container max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="blog-detail-content flex-1 bg-[#1E1E1E] rounded-2xl p-6 md:p-8 border border-[#383838]">
                        <h1 className="blog-title text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">{blog.title}</h1>
                        <h2 className="main-line text-lg md:text-xl italic mb-6 text-gray-400">{blog.intro}</h2>

                        <div className="metadata-row flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 items-start sm:items-center">
                            <div className="tags-list flex flex-wrap gap-2">
                                {blog.tags.map((tag, i) => (
                                    <span key={i} className="tag-card px-3 py-1 rounded-full text-xs md:text-sm bg-orange-500/10 text-orange-500 border border-orange-500/30">{tag}</span>
                                ))}
                                <span className="tag-card domain font-bold px-3 py-1 rounded-full text-xs md:text-sm bg-orange-500 text-white">📜 {blog.domain}</span>
                            </div>
                            <span className="author-line text-sm text-gray-400">{blog.author} • {blog.date}</span>
                        </div>

                        <hr className="mb-8 border-[#383838]" />

                        <section className="blog-section">
                            <p className="intro-paragraph mb-6 text-base md:text-lg text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.description }} />

                            {blog.points?.map(({ heading, desc }, i) => (
                                <div 
                                    key={i} 
                                    id={`section-${i}`} 
                                    className={`blog-point-block mb-8 ${activeSection === i ? 'active-section' : ''}`}
                                >
                                    <h4 className="section-heading text-xl md:text-2xl font-semibold mb-3 text-white">{heading}</h4>

                                    <div className="section-content leading-relaxed text-gray-300">
                                        {desc.split('\n').map((line, j) => (
                                            line.trim().startsWith('- ') ? (
                                                <li key={j} className="ml-5 mb-2 list-disc text-gray-300" dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '') }} />
                                            ) : (
                                                <p key={j} className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: line }} />
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>

                    {/* Right Panel - Table of Contents */}
                    <div className="blog-right-panel hidden lg:block lg:w-80">
                        <aside className="blog-toc-card sticky top-20 p-6 rounded-2xl bg-[#1E1E1E] border border-[#383838]">
                            <h3 className="text-lg font-bold mb-4 text-white">Table of Contents</h3>
                            <ul className="space-y-2">
                                {blog.points?.map(({ heading }, i) => (
                                    <li key={i} className="toc-item hover:text-orange-500 transition-colors">
                                        <a 
                                            href={`#section-${i}`} 
                                            onClick={() => handleSectionClick(i)}
                                            className="text-sm text-gray-400 hover:text-orange-500"
                                        >
                                            • {heading}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 border-t border-[#383838] pt-6">
                                <h3 className="font-bold mb-3 text-white text-sm">Related Reading</h3>
                                {relatedPosts.map(p => (
                                    <Link
                                        key={p.id}
                                        to={`/blogs/${p.id}`}
                                        className="block text-sm mb-2 text-orange-500 hover:text-orange-400 transition-colors"
                                    >
                                        • {p.title}
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetail;