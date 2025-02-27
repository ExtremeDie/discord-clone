import { Hash } from 'lucide-react';
import React from 'react';
import MobileToggle from '../mobile-toggle';
import UserAvatar from '../user-avatar';

interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: 'channel' | 'conversation';
	imageUrl?: string;
}

function ChatHeader({ serverId, name, type, imageUrl }: ChatHeaderProps) {
	return (
		<div className="flex items-center h-12 px-3 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
			<MobileToggle serverId={serverId} />
			{type === 'channel' && (
				<Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
			)}
			{type === 'conversation' && (
				<UserAvatar src={imageUrl} className="w-8 h-8 mr-2" />
			)}
			<p className="font-semibold text-black text-md dark:text-white">
				{name}
			</p>
		</div>
	);
}

export default ChatHeader;
