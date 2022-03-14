import React, { FC, useState } from 'react';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import { usePosts } from 'lib-client/react-query/posts/usePosts';
import Pagination from 'components/Pagination';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { useMe } from 'lib-client/react-query/auth/useMe';
import NoItems from 'components/NoItems';

const Drafts: FC = () => {
  const b = withBem('drafts');
  const { me } = useMe();

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = usePosts(
    QueryKeys.POSTS_DRAFTS,
    { page, userId: me?.id, published: false }
  );

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div className={b()}>
      <h1 className={b('title')}>My Drafts</h1>

      <Pagination
        onPreviousClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
        onNextClick={() => {
          if (!isPreviousData && data.pagination.hasMore) {
            setPage((oldPage) => oldPage + 1);
          }
        }}
        setPage={setPage}
        isPreviousDisabled={page === 1}
        isNextDisabled={isPreviousData || !data?.pagination.hasMore}
        currentPage={page}
        pagesCount={data.pagination.pagesCount}
        isFetching={isFetching}
        from={data.pagination.from}
        to={data.pagination.to}
        total={data.pagination.total}
      />

      <section className={b('list')}>
        {data.items.length > 0 ? (
          data.items.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <NoItems />
        )}
      </section>
    </div>
  );
};

export default Drafts;
