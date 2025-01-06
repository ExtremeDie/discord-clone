import React from 'react';
import currentProfile from '../../../../../../../lib/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../../../lib/db';
import { redirect } from 'next/navigation';
import ChatHeader from '../../../../../../../components/chat/chat-header';

interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
	const { serverId, channelId } = await params;

	const profile = await currentProfile();

	if (!profile) {
		const { redirectToSignIn } = await auth();
		return redirectToSignIn();
	}

	const channel = await db.channel.findUnique({
		where: {
			id: channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			serverId: serverId,
			profileId: profile.id,
		},
	});

	if (!channel || !member) {
		return redirect('/');
	}

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={channel.name}
				serverId={serverId}
				type="channel"
			/>
		</div>
	);
};

export default ChannelIdPage;
