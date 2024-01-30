import { http, HttpResponse } from 'msw';
import {RoomStatuses, Role} from '../types/room'
const rankingsPerPage = 10; // 페이지 당 표시할 랭킹의 수



export const handlers = [

  http.post('/api/login', async ({ request }) => {
    const requestBody = await request.json();
    console.log('Received login request:', requestBody);
  
    // 실제로는 DB에서 조회하고, 결과를 반환하겠지만 여기선 그냥 로그로 출력합니다.
    console.log('Login information retrieved from the database:', requestBody);
  
    // 정상적으로 처리되었음을 알리는 응답을 반환합니다.
    return HttpResponse.json(requestBody);
  }),
  
  http.post('/api/signup', async ({ request }) => {
    const requestBody = await request.json();
    console.log('Received signup request:', requestBody);
  
    // 실제로는 DB에 저장하고, 결과를 반환하겠지만 여기선 그냥 로그로 출력합니다.
    console.log('Signup information saved to the database:', requestBody);
  
    // 정상적으로 처리되었음을 알리는 응답을 반환합니다.
    return HttpResponse.json(requestBody);
  }),


  http.get('/api/profile', () => {
    return HttpResponse.json({
      photo: 'src/assets/ProfilePhoto.png',
      nickname: 'Kim5606'
    });
  }),

 // 랭킹 데이터를 조회하는 post 요청 처리
 http.post('/api/rankings', async ({ request }) => {
  // request.body를 사용하여 요청 본문에서 현재 페이지 번호를 가져옵니다.
  const requestBody = await request.json();
  console.log('Received request body:', requestBody); // 요청 본문 로깅
  const currentPage = typeof requestBody === 'object' && requestBody !== null && 'page' in requestBody
    ? parseInt(requestBody.page, 10)
    : 1;

  // 100개의 랭킹 데이터를 생성합니다.
  const mockRankings = [];
  for (let i = 0; i < 100; i++) {
    const profilePicNumber = Math.floor(Math.random() * 3) + 1; // 1, 2, 3 중 하나의 숫자
    const profilePic = `src/assets/Profile${profilePicNumber}.png`;
    const username = `User${i + 1}`;
    const score = Math.floor(Math.random() * (30000 - 100 + 1)) + 100; // 100 ~ 30000 사이의 랜덤한 점수

    mockRankings.push({
      profilePic,
      username,
      score,
    });
  }

  // 점수에 따라 랭킹을 내림차순으로 정렬합니다.
  mockRankings.sort((a, b) => b.score - a.score);

  // 현재 페이지에 해당하는 랭킹 데이터를 잘라서 반환합니다.
  const startIndex = (currentPage - 1) * rankingsPerPage;
  const endIndex = startIndex + rankingsPerPage;
  const paginatedRankings = mockRankings.slice(startIndex, endIndex);

  // 총 페이지 수를 계산합니다.
  const totalPages = Math.ceil(mockRankings.length / rankingsPerPage);
  console.log('Total pages:', totalPages); // 총 페이지 수 로깅

  // 비동기 방식으로 응답을 반환합니다.
  return HttpResponse.json({
    rankings: paginatedRankings,
    totalPages: totalPages
  });
}),


http.get('/api/room-data', () => {
  const roomsData = Array.from({ length: 9 }).map(() => ({
    roomid: Math.random().toString(36).substring(2, 15),
    title: Math.random().toString(36).substring(2, 12),
    roomStatus: Object.values(RoomStatuses)[Math.floor(Math.random() * Object.values(RoomStatuses).length)], // RoomStatuses 상수 사용
    creatorProfilePic: `src/assets/Profile${Math.floor(Math.random() * 3) + 1}.png`,
    backgroundUrl: `src/assets/Tetris_back${Math.floor(Math.random() * 5) + 1}.png`,
    creatorNickname: `User${Math.floor(Math.random() * 100) + 1}`,
    maxCount: Math.floor(Math.random() * 3) + 2,
  })).map(room => ({
    ...room,
    currentCount: Math.floor(Math.random() * room.maxCount) + 1,
  }));

  return HttpResponse.json({ rooms: roomsData });
}),
http.get('/api/rooms', async ({ request }) => {
  const url = new URL(request.url);
  const currentPage = Number(url.searchParams.get('page')) || 1;
  const rankingsPerPage = 9;
  const allRoomsData = Array.from({ length: 100 }).map(() => ({
    roomid: Math.random().toString(36).substring(2, 15),
    title: Math.random().toString(36).substring(2, 12),
    roomStatus: Object.values(RoomStatuses)[Math.floor(Math.random() * Object.values(RoomStatuses).length)], // RoomStatuses 상수 사용
    creatorProfilePic: `src/assets/Profile${Math.floor(Math.random() * 3) + 1}.png`,
    backgroundUrl: `src/assets/Tetris_back${Math.floor(Math.random() * 5) + 1}.png`,
    creatorNickname: `User${Math.floor(Math.random() * 100) + 1}`,
    maxCount: Math.floor(Math.random() * 3) + 2,
  })).map(room => ({
    ...room,
    currentCount: Math.floor(Math.random() * room.maxCount) + 1,
  }));
  const startIndex = (currentPage - 1) * rankingsPerPage;
  const endIndex = startIndex + rankingsPerPage;
  const roomsData = allRoomsData.slice(startIndex, endIndex);
  return HttpResponse.json({ rooms: roomsData });
}),


http.get('/api/user/profile', async ({ params }) => {
  const userId = params.userId;
  console.log(`Received request for userId: ${userId}`);

  return HttpResponse.json({
    profilePicture: `/assets/Profile${Math.floor(Math.random() * 3) + 1}.png`,
    nickname: `User${Math.floor(Math.random() * 100) + 1}`,
    Role: Object.values(Role)[Math.floor(Math.random() * Object.values(Role).length)],
    bannerBackground: `/assets/RoomHeader${Math.floor(Math.random() * 3) + 1}.png`,
  });
}),


];