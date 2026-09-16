/**
 * 编辑个人资料：用户名 / 头像（emoji 预设或上传图片）/ 简介 / 邮箱
 */
import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, FormRow, Input, Modal, Textarea } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import { readImageAsDataUrl } from '@/utils/image';

const AVATAR_PRESETS = ['😎', '🐱', '🐼', '🦊', '🚀', '🍜', '🎮', '📚', '💜', '🔥', '💃', '🧠'];

export function ProfileEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('😎');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);

  // 每次打开时同步一次当前用户资料，避免残留上次的编辑
  useEffect(() => {
    if (!open || !user) return;
    setUsername(user.username);
    setAvatar(user.avatar);
    setBio(user.bio);
    setEmail(user.email);
  }, [open, user]);

  if (!user) return null;

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      return;
    }
    setUploading(true);
    try {
      setAvatar(await readImageAsDataUrl(file, 240));
      showToast('头像已更新');
    } catch {
      showToast('图片处理失败，请换一张试试');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = () => {
    const name = username.trim();
    if (!name) {
      showToast('请输入用户名');
      return;
    }
    updateProfile({
      username: name,
      avatar,
      bio: bio.trim() || '这个用户很懒，什么也没留下',
      email: email.trim() || `${name}@example.com`,
    });
    onClose();
    showToast('资料已保存');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="✏️ 编辑资料"
      className="w-[520px]"
      footer={
        <>
          <Button variant="white" className="flex-1" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" className="flex-1" onClick={save}>
            保存
          </Button>
        </>
      }
    >
      <FormRow label="用户名" required>
        <Input
          value={username}
          maxLength={20}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="给自己取个名字"
        />
      </FormRow>

      <FormRow label="头像" hint="点选 emoji 或上传图片">
        <div className="flex flex-wrap gap-2">
          {AVATAR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-label={`使用头像 ${preset}`}
              aria-pressed={avatar === preset}
              onClick={() => setAvatar(preset)}
              className={cn(
                'flex h-11 w-11 items-center justify-center border-3 border-nb-black text-xl transition-nb hover:-translate-y-0.5 hover:shadow-nb',
                avatar === preset ? 'bg-nb-yellow shadow-nb' : 'bg-nb-white',
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Avatar value={avatar} className="h-12 w-12" textClassName="text-xl" />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <Button size="sm" variant="yellow" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? '处理中…' : '🖼 上传头像'}
          </Button>
        </div>
      </FormRow>

      <FormRow label="个人简介">
        <Textarea
          value={bio}
          rows={3}
          maxLength={80}
          onChange={(event) => setBio(event.target.value)}
          placeholder="介绍一下自己"
        />
      </FormRow>

      <FormRow label="邮箱">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </FormRow>

      <p className="text-xs font-medium leading-relaxed text-nb-muted">
        资料同样只保存在浏览器 localStorage，用于原型演示。
      </p>
    </Modal>
  );
}