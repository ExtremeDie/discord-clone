import { redirect } from 'next/navigation';
import currentProfile from '../../lib/current-profile';
import { db } from '../../lib/db';
import { ChannelType, MemberRole } from '../../types';
import ServerHeader from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
	serverId: string;
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
	[ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
	[ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
	[MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirect('/');
	}

	const server = await db.server.findUnique({
		where: {
			id: serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				orderBy: {
					createdAt: 'asc',
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: 'asc',
				},
			},
		},
	});

	if (!server) {
		redirect('/');
	}

	const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT);
	const audioChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO);
	const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO);

	const members = server.members.filter((member) => member.profileId !== profile.id);

	const role = server.members.find((member) => member.profileId === profile.id)?.role;

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: 'Text Channels',
								type: 'channel',
								data: textChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type as ChannelType],
								})),
							},
							{
								label: 'Voice Channels',
								type: 'channel',
								data: audioChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type as ChannelType],
								})),
							},
							{
								label: 'Video Channels',
								type: 'channel',
								data: videoChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type as ChannelType],
								})),
							},
							{
								label: 'Members',
								type: 'member',
								data: members.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role as MemberRole],
								})),
							},
						]}
					/>
				</div>
				<Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
				{!!textChannels?.length && (
					<div className="mb-2">
						<ServerSection label="Text Channels" server={server} role={role as MemberRole} sectionType="channels" channelType={ChannelType.TEXT} />

						<div className="space-y-[2px]">
							{textChannels.map((channel) => (
								<ServerChannel key={channel.id} channel={channel} server={server} role={role as MemberRole} />
							))}
						</div>
					</div>
				)}
				{!!audioChannels?.length && (
					<div className="mb-2">
						<ServerSection label="Voice Channels" server={server} role={role as MemberRole} sectionType="channels" channelType={ChannelType.AUDIO} />
						<div className="space-y-[2px]">
							{audioChannels.map((channel) => (
								<ServerChannel key={channel.id} channel={channel} server={server} role={role as MemberRole} />
							))}
						</div>
					</div>
				)}
				{!!videoChannels?.length && (
					<div className="mb-2">
						<ServerSection label="Video Channels" server={server} role={role as MemberRole} sectionType="channels" channelType={ChannelType.VIDEO} />
						<div className="space-y-[2px]">
							{videoChannels.map((channel) => (
								<ServerChannel key={channel.id} channel={channel} server={server} role={role as MemberRole} />
							))}
						</div>
					</div>
				)}
				{!!members?.length && (
					<div className="mb-2">
						<ServerSection label="Members" server={server} role={role as MemberRole} sectionType="members" />
						<div className="space-y-[2px]">
							{members.map((member) => (
								<ServerMember key={member.id} member={member} server={server} />
							))}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;
