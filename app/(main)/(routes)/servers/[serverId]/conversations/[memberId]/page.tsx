import React from 'react';
import currentProfile from '../../../../../../../lib/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../../../lib/db';
import { redirect } from 'next/navigation';
import { getOrCreateConversation } from '../../../../../../../lib/conversation';
import ChatHeader from '../../../../../../../components/chat/chat-header';

interface MemberIdPageProps {
	params: {
		memberId: string;
		serverId: string;
	};
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
	const { serverId, memberId } = await params;

	const profile = await currentProfile();

	if (!profile) {
		const { redirectToSignIn } = await auth();
		return redirectToSignIn();
	}

	const curremMember = await db.member.findFirst({
		where: {
			serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	if (!curremMember) {
		return redirect('/');
	}

	const conversation = await getOrCreateConversation(
		curremMember.id,
		memberId
	);

	if (!conversation) {
		return redirect(`/servers/${serverId}`);
	}

	const { memberOne, memberTwo } = conversation;

	const otherMember =
		memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
				serverId={serverId}
				type="conversation"
			/>
		</div>
	);
};

export default MemberIdPage;
