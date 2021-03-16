# 라이너 백엔드 사전과제 

### DB 설계

설계하며 가장 중요하게 생각한 것은 유저가 테마를 변경하면 모든 응답에 바뀐 테마가 적용되어야 한다는 것이었습니다. 
그리고 입출력 예시에 "pageId"가 존재하는 것을 봐선 같은 url을 사용하는 페이지는 같은 pageId를 갖도록 구현해서 중복된 url 저장을 피하라는 의미로 파악했습니다.

유저테이블에서 테마가 변경될 때 마다 응답이 달라져야 하므로 하이라이트 테이블에 칼럼을 넣지 않고,유저마다 테마값을 갖도록 칼럼을 만들었습니다. 
하이라이트를 응답할 때 마다 유저테이블에서 요청한 유저의 테마값을 가져오고, 하이라이트 테이블에 저장된 컬러값을 가져와서 테마에 맞는 색상을 응답할 수 있도록 했습니다.

하이라이트 테이블은 어떤 유저가, 어떤 페이지와 텍스트에, 몇번째 색상을 사용해서 하이라이트를 작성했는지를 알 수 있도록 구현했습니다.
user_id는 유저테이블에서 foreign key를 갖고,
page_id는 페이지테이블에서 foreign key를 가집니다.
color_id는 테마마다 3가지 색상을 갖고있기 때문에 3가지 중 몇번째 인덱스의 색상을 사용했는지를 기록합니다.

따라서, 테마별로 달라지는 색상의 colorHex값을 응답하기 위해서 모든 색상이 들어있는 colorArr를 만들고, 유저의 테마값과 color_id를 조합해서 colorArr의 인덱스를 찾고 해당하는 인덱스의 colorHex 값을 응답합니다.

colorArr은 사전과제에서 색상이 9가지 밖에 없기 때문에 테이블을 따로 만들지 않았고,
colorHex값의 종류가 많아진다면 따로 테이블을 만들어서 구현해야 한다고 생각합니다.

페이지 테이블은 중복되는 url은 같은 id를 갖도록 구현했습니다.

아래는 DB 스키마입니다.

**유저 테이블**
|**칼럼**|데이터타입
|:---:|:---:|
|id|int|
|username|string|
|password|text|
|theme|int|
|createdAt|datetime|
|updatedAt|datetime|

**하이라이트 테이블**
|**칼럼**|데이터타입
|:---:|:---:|
|id|int|
|user_id|int|
|page_id|int|
|color_id|int|
|text|text|
|createdAt|datetime|
|updatedAt|datetime|

**페이지 테이블**
|**칼럼**|데이터타입
|:---:|:---:|
|id|int|
|url|string|
|page_info|text|
|createdAt|datetime|
|updatedAt|datetime|
