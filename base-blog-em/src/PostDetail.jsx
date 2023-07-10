import { useQuery, useMutation } from 'react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isError, isLoading, error } = useQuery(
    [`comments`, post.id],
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId))
  const updateMutation = useMutation((postId) => updatePost(postId))

  const renderComments = () => {
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
    return data.map((comment) => (
      <li key={comment.id}>
        {comment.email}: {comment.body}
      </li>
    ))
  }


  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>

      <button
        onClick={() => deleteMutation.mutate(post.id)}
      >
        Delete
      </button>
      {
        deleteMutation.isError
          && <p style={{color: 'red'}}>Error deleting post =/</p>
      }
      {
        deleteMutation.isLoading
          && <p style={{color: 'red'}}>Deleting post...</p>
      }
      {
        deleteMutation.isSuccess
          && <p style={{color: 'green'}}>Deleted (or not)</p>
      }

      <button
        onClick={() => updateMutation.mutate(post.id)}
      >
        Update title
      </button>
      {
        updateMutation.isError
          && <p style={{color: 'red'}}>Error updating post =/</p>
      }
      {
        updateMutation.isLoading
          && <p style={{color: 'red'}}>Updating post...</p>
      }
      {
        updateMutation.isSuccess
          && <p style={{color: 'green'}}>Updated (or not)</p>
      }

      <p>{post.body}</p>
      <h4>Comments</h4>
      {renderComments()}
    </>
  );
}
