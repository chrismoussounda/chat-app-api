import { Injectable } from '@nestjs/common';
import { GetToken } from './dto/get-token';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  createToken = ({ roomId, username }: GetToken) => {
    // if this room doesn't exist, it'll be automatically created when the first
    // client joins
    const room = roomId;
    // identifier to be used for participant.
    // it's available as LocalParticipant.identity with livekit-client SDK
    const identity = username;

    const at = new AccessToken(
      process.env.LK_API_KEY,
      process.env.LK_SECRET_KEY,
      {
        identity,
      },
    );
    at.addGrant({ roomJoin: true, room });

    return at.toJwt();
  };
}
