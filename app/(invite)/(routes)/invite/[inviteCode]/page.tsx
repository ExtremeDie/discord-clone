import { auth } from '@clerk/nextjs/server';
import currentProfile from '../../../../../lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '../../../../../lib/db';

interface InviteCodePageProps {
	params: {
		inviteCode: string;
	};
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
	const { inviteCode } = await params;
	const profile = await currentProfile();
	const { redirectToSignIn } = await auth();

	if (!profile) {
		return redirectToSignIn();
	}
	if (!inviteCode) {
		redirect('/');
	}

	const existingServer = await db.server.findFirst({
		where: {
			inviteCode: inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});
	if (existingServer) {
		return redirect(`/servers/${existingServer.id}`);
	}

	const server = await db.server.update({
		where: {
			inviteCode: inviteCode,
		},
		data: {
			members: {
				create: [
					{
						profileId: profile.id,
					},
				],
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}

	return null;
};

export default InviteCodePage;
