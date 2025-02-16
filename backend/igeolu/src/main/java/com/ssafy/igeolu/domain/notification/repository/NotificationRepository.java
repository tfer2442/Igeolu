package com.ssafy.igeolu.domain.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.notification.entity.Notification;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
	List<Notification> findByUser_IdOrderByCreatedAtDesc(Integer id);

	@Modifying
	@Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
	void markAllAsReadByUser(@Param("user") User user);
}
