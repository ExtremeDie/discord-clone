import { RedirectToSignIn } from '@clerk/nextjs';
import currentProfile from '../../../../../lib/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../lib/db';
import { redirect } from 'next/navigation';
import ServerSidebar from '../../../../../components/server/server-sidebar';

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
	const { serverId } = await params;
	const profile = await currentProfile();

	if (!profile) {
		const { redirectToSignIn } = await auth();
		return redirectToSignIn();
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
	});

	if (!server) {
		return redirect('/');
	}

	return (
		<div className="h-full">
			<div className="fixed inset-y-0 z-20 flex-col h-full md:flex w-60">
				<ServerSidebar serverId={serverId} />
			</div>
			<main className="h-full md:pl-60">{children}</main>
		</div>
	);
};

export default ServerIdLayout;
