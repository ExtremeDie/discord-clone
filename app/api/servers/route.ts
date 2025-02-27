import currentProfile from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../lib/db';
import { MemberRole } from '../../../types';

export const POST = async (req: Request) => {
	try {
		const { name, imageUrl } = await req.json();
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const server = await db.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [
						{
							name: 'general',
							profileId: profile.id,
						},
					],
				},
				members: {
					create: [
						{
							profileId: profile.id,
							role: MemberRole.ADMIN,
						},
					],
				},
			},
		});

		return NextResponse.json(server);
	} catch (err) {
		console.log('[SERVER_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
