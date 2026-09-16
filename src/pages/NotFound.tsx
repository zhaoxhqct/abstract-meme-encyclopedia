/**
 * 404 页面
 */
import { PageContainer } from '@/components/layout';
import { ButtonLink, Empty } from '@/components/ui';

export default function NotFound() {
  return (
    <PageContainer>
      <Empty
        kind="notfound"
        title="404 · 这个梗还没被收录"
        description="页面走丢了，回到首页继续逛吧"
        action={
          <div className="flex flex-wrap justify-center gap-2.5">
            <ButtonLink to="/" variant="primary">
              返回首页
            </ButtonLink>
            <ButtonLink to="/explore" variant="white">
              去探索
            </ButtonLink>
          </div>
        }
      />
    </PageContainer>
  );
}