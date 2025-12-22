package com.motorbike.business.usecase.control;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.motorbike.business.dto.adduser.AddUserInputData;
import com.motorbike.business.dto.adduser.AddUserOutputData;
import com.motorbike.business.ports.repository.CartRepository;
import com.motorbike.business.ports.repository.UserRepository;
import com.motorbike.business.usecase.output.AddUserOutputBoundary;

class AddUserUseCaseControlTest {

    private UserRepository userRepository;
    private CartRepository cartRepository;
    private AddUserOutputBoundary outputBoundary;
    private AddUserUseCaseControl useCase;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        cartRepository = mock(CartRepository.class);
        outputBoundary = mock(AddUserOutputBoundary.class);
        useCase = new AddUserUseCaseControl(outputBoundary, userRepository, cartRepository);
    }


    // ===== TC01: input null => error =====
    @Test
    void should_return_error_when_input_is_null() {
        useCase.execute(null);

        AddUserOutputData output = captureOutput();
        assertFalse(output.isSuccess());
        assertNotNull(output.getErrorCode());
    }

    // ===== TC02: email đã tồn tại => error =====
    @Test
    void should_return_error_when_email_exists() {
        AddUserInputData input = AddUserInputData.of(
                "a@gmail.com", "user", "pw", "0909", "HCM", "USER", true
        );

        when(userRepository.existsByEmail("a@gmail.com")).thenReturn(true);

        useCase.execute(input);

        AddUserOutputData output = captureOutput();
        assertFalse(output.isSuccess());
        assertNotNull(output.getErrorCode());
    }

    // ===== TC03: Thêm user thành công =====
    @Test
    void should_create_user_and_cart_successfully() {
        AddUserInputData input = AddUserInputData.of(
                "a@gmail.com", "user", "pw", "0909090909", "HCM", "USER", true
        );

        when(userRepository.existsByEmail("a@gmail.com")).thenReturn(false);

        // save user ok - trả về user với maTaiKhoan
        when(userRepository.save(any())).thenAnswer(inv -> {
            var user = inv.getArgument(0, com.motorbike.domain.entities.TaiKhoan.class);
            // giả lập ID được tạo sau khi save
            user.setMaTaiKhoan(1);
            return user;
        });
        
        // save cart ok
        when(cartRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(input);

        AddUserOutputData output = captureOutput();
        assertTrue(output.isSuccess());
        assertNotNull(output.getUserId());
        assertEquals("a@gmail.com", output.getEmail());
        assertEquals("user", output.getUsername());

        // ✅ đảm bảo có gọi save user và tạo giỏ hàng
        verify(userRepository, times(1)).save(any());
        verify(cartRepository, times(1)).save(any());
    }

    // ===== TC04:Lỗi hệ thống =====
    @Test
    void should_return_system_error_when_repository_throw_exception() {
        AddUserInputData input = AddUserInputData.of(
                "a@gmail.com", "user", "pw", "0909", "HCM", "USER", true
        );

        when(userRepository.existsByEmail(any())).thenThrow(new RuntimeException("DB error"));

        useCase.execute(input);

        AddUserOutputData output = captureOutput();
        assertFalse(output.isSuccess());
        assertEquals("SYSTEM_ERROR", output.getErrorCode());
    }

    private AddUserOutputData captureOutput() {
        ArgumentCaptor<AddUserOutputData> captor = ArgumentCaptor.forClass(AddUserOutputData.class);
        verify(outputBoundary).present(captor.capture());
        return captor.getValue();
    }
}
