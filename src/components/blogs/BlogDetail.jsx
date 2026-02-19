import './Blogs.scss';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from './Blogs';

const BlogDetail = () => {
    const { id } = useParams();
    const blog = blogPosts.find((post) => post.id === Number(id));

    if (!blog) return <p className="text-white p-10">Blog not found.</p>;

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
        <section className="blog-detail-wrapper p-4 md:p-10">
            <div className="blog-detail-container">
                <div className="blog-detail-content">
                    <h1 className="blog-title text-3xl font-bold mb-4 text-white">{blog.title}</h1>
                    <h2 className="main-line text-xl italic mb-6 text-gray-400">{blog.intro}</h2>

                    <div className="metadata-row flex gap-4 mb-4 items-center">
                        <div className="tags-list flex gap-2">
                            {blog.tags.map((tag, i) => (
                                <span key={i} className="tag-card p-1 rounded text-sm">{tag}</span>
                            ))}
                            <span className="tag-card domain font-bold">📜 {blog.domain}</span>
                        </div>
                        <span className="author-line text-gray-400">{blog.author} • {blog.date}</span>
                    </div>

                    <hr className="mb-8 border-[#3f3f46]" />

                    <section className="blog-section">
                        <p className="intro-paragraph mb-6 text-lg" dangerouslySetInnerHTML={{ __html: blog.description }} />

                        {blog.points?.map(({ heading, desc }, i) => (
                            <div key={i} id={`section-${i}`} className="blog-point-block mb-8">
                                <h4 className="section-heading text-2xl font-semibold mb-2 text-white">{heading}</h4>

                                <div className="section-content leading-relaxed">
                                    {desc.split('\n').map((line, j) => (
                                        line.trim().startsWith('- ') ? (
                                            <li key={j} className="ml-5 list-disc text-gray-300" dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '') }} />
                                        ) : (
                                            <p key={j} className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: line }} />
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="blog-right-panel hidden lg:block w-1/3">
                    <aside className="blog-toc-card sticky top-20 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                        <ul className="space-y-2">
                            {blog.points?.map(({ heading }, i) => (
                                <li key={i} className="hover:underline">
                                    <a href={`#section-${i}`}>{heading}</a>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 border-t border-[#3f3f46] pt-4">
                            <h3 className="font-bold mb-2 text-white">Related Reading</h3>
                            {relatedPosts.map(p => (
                                <Link
                                    key={p.id}
                                    to={`/blogs/${p.id}`}
                                    className="block text-sm mb-2 text-orange-500 hover:text-orange-400"
                                >
                                    • {p.title}
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default BlogDetail;