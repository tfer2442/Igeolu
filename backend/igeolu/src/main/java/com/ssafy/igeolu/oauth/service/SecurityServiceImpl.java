package com.ssafy.igeolu.oauth.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;
import com.ssafy.igeolu.oauth.dto.MyInfoDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {
	private final UserRepository userRepository;

	@Override
	public MyInfoDto getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getPrincipal() == null
			|| "anonymousUser".equals(authentication.getPrincipal())) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}

		if (authentication.getPrincipal() instanceof CustomOAuth2User principal) {
			Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
			Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
			GrantedAuthority auth = iterator.next();
			String role = auth.getAuthority();

			return MyInfoDto.builder()
				.userId(principal.getUserId())
				.role(role)
				.build();
		}

		throw new CustomException(ErrorCode.UNAUTHORIZED);
	}

	/**
	 * 카카오 사용자 정보를 기반으로 회원 존재 여부를 확인하고, 존재하지 않으면 신규 가입을 진행합니다.
	 * 기존 회원이 있을 경우, 요청된 state에 따른 Role과 일치하지 않으면 예외를 발생시킵니다.
	 */
	@Transactional
	@Override
	public User processOAuth2User(String kakaoId, String nickName, String state) {

		return userRepository.findByKakaoId(kakaoId)
			.map(existingUser -> {
				validateRole(existingUser);
				return existingUser;
			})
			.orElseGet(() -> userRepository.save(
				User.builder()
					.role(getSignupRole(state))
					.kakaoId(kakaoId)
					.username(nickName)
					.profileFilePath(getSignupRole(state) == Role.ROLE_MEMBER ? "/igeolu-file/member.jpg" : "/igeolu-files/realtor.jpg")
					.build()
			));
	}

	private static void validateRole(User existingUser) {
		List<Role> matchRoles = Arrays.stream(Role.values())
			.filter(role -> role.equals(existingUser.getRole()))
			.toList();

		if (matchRoles.isEmpty()) {
			throw new OAuth2AuthenticationException("Role mismatch. Login and signup are disallowed.");
		}
	}

	public User getUserEntity() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getPrincipal() == null
			|| "anonymousUser".equals(authentication.getPrincipal())) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}

		if (authentication.getPrincipal() instanceof CustomOAuth2User principal) {
			return userRepository.findById(principal.getUserId())
				.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		}

		throw new CustomException(ErrorCode.UNAUTHORIZED);
	}

	/**
	 * state 파라미터에 따른 Role을 반환합니다.
	 *
	 */
	private Role getSignupRole(String state) {
		return "member".equals(state) ? Role.ROLE_MEMBER : Role.ROLE_INCOMPLETE_REALTOR;
	}
}
