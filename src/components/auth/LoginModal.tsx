/**
 * 登录 / 注册弹窗（本地 mock）
 */
import { useEffect, useRef, useState } from 'react';
import { Button, FormRow, Input, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useUiStore } from '@/store/useUiStore';
import { cn } from '@/utils/cn';

type Mode = 'login' | 'register';

export function LoginModal() {
  const open = useUiStore((state) => state.loginOpen);
  const closeLogin = useUiStore((state) => state.closeLogin);
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  // 打开时聚焦用户名输入框，方便键盘操作
  useEffect(() => {
    if (open) window.setTimeout(() => nameRef.current?.focus(), 60);
  }, [open]);

  const submit = () => {
    const name = username.trim();
    if (!name) {
      showToast('请输入用户名');
      return;
    }
    login(name);
    closeLogin();
    setUsername('');
    setPassword('');
    showToast(mode === 'login' ? `欢迎回来，${name}！` : `注册成功，${name}！`);
  };

  const useDemo = () => {
    loginAsDemo();
    closeLogin();
    showToast('已登录演示账号');
  };

  return (
    <Modal
      open={open}
      onClose={closeLogin}
      title="🔐 登录 / 注册"
      footer={
        <>
          <Button variant="white" className="flex-1" onClick={closeLogin}>
            取消
          </Button>
          <Button variant="primary" className="flex-1" onClick={submit}>
            {mode === 'login' ? '登录' : '注册'}
          </Button>
        </>
      }
    >
      <div className="mb-5 flex border-3 border-nb-black p-1">
        {(['login', 'register'] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            aria-pressed={mode === item}
            className={cn(
              'flex-1 border-3 px-4 py-2 text-sm font-bold transition-nb',
              mode === item
                ? 'border-nb-black bg-nb-black text-nb-yellow'
                : 'border-transparent hover:bg-nb-bg',
            )}
          >
            {item === 'login' ? '登录' : '注册'}
          </button>
        ))}
      </div>

      <FormRow label="用户名" required>
        <Input
          ref={nameRef}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit();
          }}
          placeholder="请输入用户名"
          maxLength={20}
        />
      </FormRow>

      <FormRow label="密码" hint="演示版可留空">
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit();
          }}
          placeholder="请输入密码"
        />
      </FormRow>

      <p className="text-xs font-medium leading-relaxed text-nb-muted">
        这是原型阶段的本地模拟登录：账号信息只保存在浏览器 localStorage，不会上传到任何服务器。
      </p>

      <button
        type="button"
        onClick={useDemo}
        className="mt-4 w-full border-3 border-dashed border-nb-black bg-nb-bg px-4 py-2.5 text-sm font-bold transition-nb hover:bg-nb-yellow"
      >
        😎 使用演示账号（自带点赞 / 收藏数据）
      </button>
    </Modal>
  );
}