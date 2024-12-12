'use client';

import { Plus, Settings } from 'lucide-react';
import { ChannelType, MemberRole, ServerWithMembersWithProfiles } from '../../types';
import { ActionTooltip } from '../action-tooltip';
import { useModal } from '../../hooks/use-modal-store';

interface ServerSectionProps {
	label: string;
	role?: MemberRole;
	sectionType: 'channels' | 'members';
	channelType?: ChannelType;
	server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
	const { onOpen } = useModal();

	return (
		<div className="flex items-center justify-between py-2">
			<p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">{label}</p>
			{role !== MemberRole.GUEST && sectionType === 'channels' && (
				<ActionTooltip label="Create Channel">
					<button onClick={() => onOpen('createChannel', { server, channelType })} className="transition text-zinc-500 hover:text-zinc-60 dark:text-zinc-400 dark:hover:text-zinc-300">
						<Plus className="w-4 h-4 " />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === 'members' && (
				<ActionTooltip label="Manage Members">
					<button onClick={() => onOpen('members', { server, channelType })} className="transition text-zinc-500 hover:text-zinc-60 dark:text-zinc-400 dark:hover:text-zinc-300">
						<Settings className="w-4 h-4 " />
					</button>
				</ActionTooltip>
			)}
		</div>
	);
};

export default ServerSection;
