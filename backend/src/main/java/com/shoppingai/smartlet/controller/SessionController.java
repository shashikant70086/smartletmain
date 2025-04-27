package com.shoppingai.smartlet.controller;

import com.shoppingai.smartlet.model.ChatSession;
import com.shoppingai.smartlet.model.Message;
import com.shoppingai.smartlet.model.User;
import com.shoppingai.smartlet.repository.ChatSessionRepository;
import com.shoppingai.smartlet.repository.MessageRepository;
import com.shoppingai.smartlet.repository.UserRepository;
import com.shoppingai.smartlet.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class SessionController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ChatSessionRepository chatSessionRepository;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    JwtUtil jwtUtil;

    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.getEmailFromToken(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email).orElseThrow();
        List<ChatSession> sessions = chatSessionRepository.findAllByUser(user);

        return ResponseEntity.ok(sessions.stream().map(s -> Map.of(
                "sessionId", s.getSessionId(),
                "title", s.getTitle()
        )));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<?> getMessages(@PathVariable String id,
                                         @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.getEmailFromToken(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email).orElseThrow();
        ChatSession session = chatSessionRepository.findBySessionIdAndUser(id, user)
                .orElseThrow();

        List<Message> messages = messageRepository.findBySession(session);
        return ResponseEntity.ok(Map.of("messages", messages));
    }

    @Transactional
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable String id,
                                           @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.getEmailFromToken(authHeader.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email).orElseThrow();

        ChatSession session = chatSessionRepository.findBySessionIdAndUser(id, user)
                .orElseThrow();

        // Delete all messages linked to this session first
        messageRepository.deleteAll(messageRepository.findBySession(session));

        // Then delete the session itself
        chatSessionRepository.delete(session);

        return ResponseEntity.noContent().build();
    }
}
