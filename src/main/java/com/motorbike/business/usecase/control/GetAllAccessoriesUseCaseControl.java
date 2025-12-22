package com.motorbike.business.usecase.control;

import java.util.List;
import java.util.stream.Collectors;

import com.motorbike.business.dto.accessory.GetAllAccessoriesOutputData;
import com.motorbike.business.dto.accessory.GetAllAccessoriesOutputData.AccessoryItem;
import com.motorbike.business.ports.repository.AccessoryRepository;
import com.motorbike.business.usecase.input.GetAllAccessoriesInputBoundary;
import com.motorbike.business.usecase.output.GetAllAccessoriesOutputBoundary;
import com.motorbike.domain.entities.PhuKienXeMay;

public class GetAllAccessoriesUseCaseControl implements GetAllAccessoriesInputBoundary {

    private final GetAllAccessoriesOutputBoundary outputBoundary;
    private final AccessoryRepository accessoryRepository;

    public GetAllAccessoriesUseCaseControl(
            GetAllAccessoriesOutputBoundary outputBoundary,
            AccessoryRepository accessoryRepository
    ) {
        this.outputBoundary = outputBoundary;
        this.accessoryRepository = accessoryRepository;
    }

    @Override
    public void execute(Void inputData) {
        GetAllAccessoriesOutputData outputData = null;
        Exception errorException = null;

        try {
                List<PhuKienXeMay> allAccessories = accessoryRepository.findAllAccessories();

                List<AccessoryItem> accessories = allAccessories.stream()
                    .map(pk -> new AccessoryItem(
                        pk.getMaSanPham(),
                        pk.getTenSanPham(),
                        pk.getMoTa(),
                        pk.getGia(),
                        pk.getSoLuongTonKho(),
                        pk.getHinhAnh(),
                        pk.getLoaiPhuKien(),
                        pk.getThuongHieu(),
                        pk.getChatLieu(),
                        pk.getKichThuoc()
                    ))
                    .collect(Collectors.toList());

            outputData = new GetAllAccessoriesOutputData(accessories);
        } catch (Exception e) {
            errorException = e;
        }

        if (errorException != null) {
            outputData = new GetAllAccessoriesOutputData("SYSTEM_ERROR", errorException.getMessage());
        }

        outputBoundary.present(outputData);
    }
}
