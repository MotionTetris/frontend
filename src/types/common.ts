export interface ApiResponse {
  rankings: {
    profilePic: string;
    username: string;
    score: number;
  }[];
  totalPages: number;
}

export interface StyledLinkProps {
  active: boolean;
  image: string; // 이미지 URL을 위한 속성 추가
}

export interface CommonState {
  apiResponse: ApiResponse;
  styledLinkProps: StyledLinkProps;
}

export interface ModalProps extends VisibilityProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export interface VisibilityProps {
  isVisible: boolean;
}
