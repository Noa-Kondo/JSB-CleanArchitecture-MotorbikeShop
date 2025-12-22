package com.motorbike.adapters.repositories;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.motorbike.business.ports.repository.ProductRepository;
import com.motorbike.domain.entities.PhuKienXeMay;
import com.motorbike.domain.entities.SanPham;
import com.motorbike.domain.entities.XeMay;
import com.motorbike.infrastructure.persistence.jpa.entities.PhuKienXeMayJpaEntity;
import com.motorbike.infrastructure.persistence.jpa.entities.SanPhamJpaEntity;
import com.motorbike.infrastructure.persistence.jpa.entities.XeMayJpaEntity;
import com.motorbike.infrastructure.persistence.jpa.repositories.PhuKienXeMayJpaRepository;
import com.motorbike.infrastructure.persistence.jpa.repositories.SanPhamJpaRepository;
import com.motorbike.infrastructure.persistence.jpa.repositories.XeMayJpaRepository;

@Component
public class ProductRepositoryAdapter implements ProductRepository {

    private final SanPhamJpaRepository sanPhamJpaRepository;
    private final XeMayJpaRepository xeMayJpaRepository;
    private final PhuKienXeMayJpaRepository phuKienJpaRepository;

    public ProductRepositoryAdapter(
            SanPhamJpaRepository sanPhamJpaRepository,
            XeMayJpaRepository xeMayJpaRepository,
            PhuKienXeMayJpaRepository phuKienJpaRepository
    ) {
        this.sanPhamJpaRepository = sanPhamJpaRepository;
        this.xeMayJpaRepository = xeMayJpaRepository;
        this.phuKienJpaRepository = phuKienJpaRepository;
    }
    
    @Override
    public Optional<SanPham> findById(Long id) {
        // Prefer concrete repositories to avoid polymorphic issues
        Optional<XeMayJpaEntity> xeMay = xeMayJpaRepository.findById(id);
        if (xeMay.isPresent()) {
            return Optional.of(toDomain(xeMay.get()));
        }
        Optional<PhuKienXeMayJpaEntity> pk = phuKienJpaRepository.findById(id);
        if (pk.isPresent()) {
            return Optional.of(toDomain(pk.get()));
        }

        return sanPhamJpaRepository.findById(id).map(this::toDomain);
    }
    
    @Override
    public SanPham save(SanPham sanPham) {
        SanPhamJpaEntity jpaEntity = toJpaEntity(sanPham);
        SanPhamJpaEntity saved;
        if (jpaEntity instanceof XeMayJpaEntity) {
            saved = xeMayJpaRepository.save((XeMayJpaEntity) jpaEntity);
        } else if (jpaEntity instanceof PhuKienXeMayJpaEntity) {
            saved = phuKienJpaRepository.save((PhuKienXeMayJpaEntity) jpaEntity);
        } else {
            // Fallback to base repository
            saved = sanPhamJpaRepository.save(jpaEntity);
        }
        return toDomain(saved);
    }
    
    @Override
    public boolean existsById(Long id) {
        return sanPhamJpaRepository.existsById(id);
    }
    
    @Override
    public java.util.List<SanPham> findAll() {
        // Fetch from concrete repositories to avoid base entity persister issues
        java.util.List<SanPham> result = new java.util.ArrayList<>();
        xeMayJpaRepository.findAll().forEach(e -> result.add(toDomain(e)));
        phuKienJpaRepository.findAll().forEach(e -> result.add(toDomain(e)));
        return result;
    }
    
    
    private SanPham toDomain(SanPhamJpaEntity jpaEntity) {
        if (jpaEntity instanceof XeMayJpaEntity) {
            XeMayJpaEntity xeMay = (XeMayJpaEntity) jpaEntity;
            return new XeMay(
                    xeMay.getMaSanPham(),
                    xeMay.getTenSanPham(),
                    xeMay.getMoTa(),
                    xeMay.getGia(),
                    xeMay.getHinhAnh(),
                    xeMay.getSoLuongTonKho(),
                    xeMay.isConHang(),
                    xeMay.getNgayTao(),
                    xeMay.getNgayCapNhat(),
                    xeMay.getHangXe(),
                    xeMay.getDongXe(),
                    xeMay.getMauSac(),
                    xeMay.getNamSanXuat(),
                    xeMay.getDungTich()
            );
        } else if (jpaEntity instanceof PhuKienXeMayJpaEntity) {
            PhuKienXeMayJpaEntity phuKien = (PhuKienXeMayJpaEntity) jpaEntity;
            return new PhuKienXeMay(
                    phuKien.getMaSanPham(),
                    phuKien.getTenSanPham(),
                    phuKien.getMoTa(),
                    phuKien.getGia(),
                    phuKien.getHinhAnh(),
                    phuKien.getSoLuongTonKho(),
                    phuKien.isConHang(),
                    phuKien.getNgayTao(),
                    phuKien.getNgayCapNhat(),
                    phuKien.getLoaiPhuKien(),
                    phuKien.getThuongHieu(),
                    phuKien.getChatLieu(),
                    phuKien.getKichThuoc()
            );
        }
        
        throw new IllegalArgumentException("Unknown product type: " + jpaEntity.getClass());
    }
    
    private SanPhamJpaEntity toJpaEntity(SanPham domain) {
        if (domain instanceof XeMay) {
            XeMay xeMay = (XeMay) domain;
            XeMayJpaEntity jpa = new XeMayJpaEntity();
            jpa.setMaSanPham(xeMay.getMaSanPham());
            jpa.setTenSanPham(xeMay.getTenSanPham());
            jpa.setMoTa(xeMay.getMoTa());
            jpa.setGia(xeMay.getGia());
            jpa.setHinhAnh(xeMay.getHinhAnh());
            jpa.setSoLuongTonKho(xeMay.getSoLuongTonKho());
            jpa.setConHang(xeMay.isConHang());
            jpa.setLoaiSanPham("XE_MAY");  // FIX: Set loaiSanPham
            jpa.setHangXe(xeMay.getHangXe());
            jpa.setDongXe(xeMay.getDongXe());
            jpa.setMauSac(xeMay.getMauSac());
            jpa.setNamSanXuat(xeMay.getNamSanXuat());
            jpa.setDungTich(xeMay.getDungTich());
            return jpa;
            
        } else if (domain instanceof PhuKienXeMay) {
            PhuKienXeMay phuKien = (PhuKienXeMay) domain;
            PhuKienXeMayJpaEntity jpa = new PhuKienXeMayJpaEntity();
            jpa.setMaSanPham(phuKien.getMaSanPham());
            jpa.setTenSanPham(phuKien.getTenSanPham());
            jpa.setMoTa(phuKien.getMoTa());
            jpa.setGia(phuKien.getGia());
            jpa.setHinhAnh(phuKien.getHinhAnh());
            jpa.setSoLuongTonKho(phuKien.getSoLuongTonKho());
            jpa.setConHang(phuKien.isConHang());
            jpa.setLoaiSanPham("PHU_KIEN");  // FIX: Set loaiSanPham
            jpa.setLoaiPhuKien(phuKien.getLoaiPhuKien());
            jpa.setThuongHieu(phuKien.getThuongHieu());
            jpa.setChatLieu(phuKien.getChatLieu());
            jpa.setKichThuoc(phuKien.getKichThuoc());
            return jpa;
        }
        
        throw new IllegalArgumentException("Unknown product type: " + domain.getClass());
    }
}
