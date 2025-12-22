package com.motorbike.business.usecase.control;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;

import com.motorbike.adapters.presenters.SearchAccessoriesPresenter;
import com.motorbike.adapters.viewmodels.SearchAccessoriesViewModel;
import com.motorbike.business.dto.accessory.SearchAccessoriesInputData;
import com.motorbike.business.ports.repository.AccessoryRepository;
import com.motorbike.business.usecase.output.SearchAccessoriesOutputBoundary;
import com.motorbike.domain.entities.PhuKienXeMay;

public class SearchAccessoriesUseCaseControlTest {

    @Test
    public void testSearchByKeyword() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData("mũ", null, null, null, null, null);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(1, vm.accessories.size());
    }

    @Test
    public void testSearchByTypeAndBrand() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData(null, "Găng tay bảo hộ", "SafeHand", null, null, null);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(1, vm.accessories.size());
    }

    @Test
    public void testSearchByPriceRange() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData(null, null, null, null, 100000.0, 300000.0);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(2, vm.accessories.size());
    }

    @Test
    public void testSearch_NullInput_ReturnsAll() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        control.execute(null);

        assertFalse(vm.hasError);
        assertEquals(3, vm.accessories.size());
    }

    @Test
    public void testSearch_CaseInsensitive() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData("MŨ", null, null, null, null, null);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(1, vm.accessories.size());
    }

    @Test
    public void testSearch_NoMatches() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData("khongtontai", null, null, null, null, null);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(0, vm.accessories.size());
    }

    @Test
    public void testSearch_MinGreaterThanMax() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData(null, null, null, null, 500000.0, 100000.0);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(0, vm.accessories.size());
    }

    @Test
    public void testSearch_ByMaterial() {
        AccessoryRepository repo = new MockAccessoryRepo();
        SearchAccessoriesViewModel vm = new SearchAccessoriesViewModel();
        SearchAccessoriesOutputBoundary presenter = new SearchAccessoriesPresenter(vm);

        SearchAccessoriesUseCaseControl control = new SearchAccessoriesUseCaseControl(presenter, repo);
        SearchAccessoriesInputData input = new SearchAccessoriesInputData(null, null, null, "Da", null, null);
        control.execute(input);

        assertFalse(vm.hasError);
        assertEquals(1, vm.accessories.size());
    }

    private static class MockAccessoryRepo implements AccessoryRepository {

        @Override
        public PhuKienXeMay save(PhuKienXeMay accessory) {
            return accessory;
        }

        @Override
        public java.util.Optional<PhuKienXeMay> findById(Long id) {
            return java.util.Optional.empty();
        }

        @Override
        public List<PhuKienXeMay> findAllAccessories() {
            List<PhuKienXeMay> list = new ArrayList<>();
            PhuKienXeMay p1 = new PhuKienXeMay("Mũ bảo hiểm Royal","Mũ fullface", new BigDecimal("900000"), "/img/helmet.jpg", 50, "Mũ bảo hiểm", "Royal", "Nhựa", "L");
            PhuKienXeMay p2 = new PhuKienXeMay("Găng tay bảo hộ","Găng tay da", new BigDecimal("250000"), "/img/gloves.jpg", 100, "Găng tay bảo hộ", "SafeHand", "Da", "M");
            PhuKienXeMay p3 = new PhuKienXeMay("Áo mưa","Áo mưa chống nước", new BigDecimal("120000"), "/img/raincoat.jpg", 200, "Áo mưa", "RainPro", "Vải", "XL");
            list.add(p1);
            list.add(p2);
            list.add(p3);
            return list;
        }

        @Override
        public void deleteById(Long id) {
            // Mock method - no operation
        }
    }
}
