import { Server, Member, Profile } from '@prisma/client';

export enum MemberRole {
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	GUEST = 'GUEST',
}

export enum ChannelType {
	TEXT = 'TEXT',
	AUDIO = 'AUDIO',
	VIDEO = 'VIDEO',
}

export type ServerWithMembersWithProfiles = Server & {
	members: (Member & { profile: Profile })[];
};
