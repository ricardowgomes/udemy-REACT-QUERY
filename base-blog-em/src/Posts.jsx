import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from 'react-query';

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery(
        ['posts', nextPage],
        () => fetchPosts(nextPage)
      )
    }
  }, [currentPage, queryClient]);

  // staleTime default is 0ms
  // cacheTime default is 5m
  const { data, isError, isLoading, error } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage), {
    staleTime: 2000,
    keepPreviousData: true,
  });

  if (isLoading) return (<h3>Loading...</h3>);
  // By default react query will try 3 times
  if (isError) {
    return (
      <div>
        <h3>Oops, something went wrong =\</h3>
        <p>{error.toString()}</p>
      </div>
    )
  };

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
